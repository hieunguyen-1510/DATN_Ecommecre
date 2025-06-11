import {
  createMomoPayment as momoServiceCreate,
  handleMomoIPN as momoServiceIPN,
  checkStatusPayment,
} from "../services/momo.Service.js";

import {
  createVnpayPayment as vnpayServiceCreate,
  handleVnpayIPN as vnpayServiceIPN,
  handleVnpayReturn as vnpayServiceReturn,
} from "../services/vnpay.service.js";

import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js"; 
import Report from "../models/reportModel.js";

// Thanh toán thành công
const renderSuccessPage = (res, frontendUrl) => {
  res.send(`
    <html>
      <head>
        <title>Thanh toán thành công</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9fafb;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
          }
          .container {
            background: white;
            padding: 40px 60px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            width: 90%;
          }
          h2 {
            color: #2f855a;
            margin-bottom: 24px;
            font-weight: 700;
          }
          a {
            display: inline-block;
            padding: 12px 30px;
            background-color: #38a169;
            color: white;
            text-decoration: none;
            font-weight: 600;
            border-radius: 6px;
            transition: background-color 0.3s ease;
          }
          a:hover {
            background-color: #2f855a;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Cảm ơn bạn đã mua hàng!</h2>
          <a href="${frontendUrl}">Quay lại trang chủ</a>
        </div>
      </body>
    </html>
  `);
};

const paymentController = {
  createMomoPayment: async (req, res) => {
    try {
      const { orderId, amount, orderInfo, orderData } = req.body;

      if (!orderId || !amount || !orderInfo) {
        return res.status(400).json({ message: "Missing input information." });
      }

      const result = await momoServiceCreate({
        orderId,
        amount,
        orderInfo,
        orderData,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  handleMomoIPN: async (req, res) => {
    try {
      const data = req.body;
      const result = await momoServiceIPN(data);

      if (result.resultCode === 0) {
        const { orderId } = data;

        const payment = await Payment.findOne({ orderId });
        if (!payment) {
          return res
            .status(404)
            .json({ message: "Payment information not found." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: "Order not found." });
        }

        payment.status = "completed";
        payment.momoResponse = result;
        await payment.save();

        order.status = "Delivered";
        order.paymentStatus = "completed";
        await order.save();

        let revenueReport = await Report.findOne({ type: "total_revenue" });
        if (!revenueReport) {
          revenueReport = new Report({
            type: "total_revenue",
            data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
          });
        }
        revenueReport.data.totalRevenue.total += order.totalAmount;
        revenueReport.data.totalRevenue.lastUpdated = new Date();
        await revenueReport.save();
      }
      res.status(200).json({ message: "IPN processed successfully", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  handleMomoReturn: async (req, res) => {
    try {
      const { resultCode, orderId } = req.query;
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      if (resultCode === "0") {
        renderSuccessPage(res, frontendUrl);
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment-fail?orderId=${orderId}`
        );
      }
    } catch (error) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }
  },

  checkMomoPaymentStatus: async (req, res) => {
    try {
      const { momoOrderId } = req.params;
      const payment = await Payment.findOne({ momoOrderId });
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found.",
        });
      }

      const statusData = await checkStatusPayment({ momoOrderId });

      payment.status = statusData.resultCode === 0 ? "completed" : "failed";
      payment.momoResponse = statusData;
      await payment.save();

      if (statusData.resultCode === 0) {
        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = "Delivered";
          order.paymentStatus = "completed";
          await order.save();

          let revenueReport = await Report.findOne({ type: "total_revenue" });
          if (!revenueReport) {
            revenueReport = new Report({
              type: "total_revenue",
              data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
            });
          }
          revenueReport.data.totalRevenue.total += order.totalAmount;
          revenueReport.data.totalRevenue.lastUpdated = new Date();
          await revenueReport.save();
        }
      }

      res.json({
        success: true,
        status: payment.status,
        orderId: payment.orderId,
      });
    } catch (error) {
      console.error("Error checking MoMo status:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  checkStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const payment = await Payment.findOne({ orderId });

      if (!payment) {
        return res.status(404).json({ message: "Order not found." });
      }

     
      if (payment.method === "MOMO" && payment.status === "pending") {
        const statusResult = await checkStatusPayment({
          momoOrderId: payment.momoOrderId || "",
        });

        // Update payment status in DB based on MoMo's check
        payment.status = statusResult.resultCode === 0 ? "completed" : "failed";
        await payment.save();

        if (statusResult.resultCode === 0) {
          const order = await Order.findByIdAndUpdate(
            payment.orderId,
            {
              status: "Delivered",
              paymentStatus: "completed",
            },
            { new: true }
          ).populate("items.productId");

          let revenueReport = await Report.findOne({ type: "total_revenue" });
          if (!revenueReport) {
            revenueReport = new Report({
              type: "total_revenue",
              data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
            });
          }
          revenueReport.data.totalRevenue.total += order.totalAmount;
          revenueReport.data.totalRevenue.lastUpdated = new Date();
          await revenueReport.save();
        }
      }
     

      res.status(200).json({ status: payment.status });
    } catch (error) {
      res.status(500).json({
        message: "Error checking payment status.",
        error: error.message,
      });
    }
  },

  // create vnpay
   createVnpayPayment: async (req, res) => {
    try {
      const { amount, orderInfo, bankCode, orderId } = req.body;
      const ipAddr = req.ip || req.connection.remoteAddress || "127.0.0.1";

      if (!amount || !orderInfo || !orderId) {
        return res.status(400).json({ message: "Missing input information." });
      }

      const paymentUrl = await vnpayServiceCreate({
        amount,
        orderInfo,
        bankCode,
        ipAddr,
        orderId,
      });

      res.status(200).json({ paymentUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

 handleVnpayIPN: async (req, res) => {
    try {
      const result = await vnpayServiceIPN(req.query);
      
      if (result.RspCode === '00') {
        const transactionId = req.query.vnp_TxnRef;
        const payment = await Payment.findOne({ transactionId });
        
        if (payment) {
          const order = await Order.findById(payment.orderId);
          if (order) {
            order.status = "Delivered";
            order.paymentStatus = "completed";
            await order.save();

            let revenueReport = await Report.findOne({ type: "total_revenue" });
            if (!revenueReport) {
              revenueReport = new Report({
                type: "total_revenue",
                data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
              });
            }
            revenueReport.data.totalRevenue.total += order.totalAmount;
            revenueReport.data.totalRevenue.lastUpdated = new Date();
            await revenueReport.save();
          }
        }
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in handleVnpayIPN controller:", error);
      res.status(200).json({ RspCode: '99', Message: error.message });
    }
  },

handleVnpayReturn: async (req, res) => {
  try {
    console.log("VNPay Return received:", req.query);
    const secretKey = process.env.VNPAY_HASH_SECRET?.trim();
    if (!secretKey) {
      throw new Error("Missing VNPAY_HASH_SECRET environment variable.");
    }

    let vnpParams = { ...req.query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);
    const signData = querystring.stringify(vnpParams, { encode: false });

    console.log("Return Data to be signed:", signData);

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("Calculated SecureHash:", signed);
    console.log("Received SecureHash:", secureHash);

    if (secureHash !== signed) {
      console.error("Signature mismatch", { calculated: signed, received: secureHash });
      throw new Error("Invalid signature.");
    }

    const vnpResponseCode = vnpParams["vnp_ResponseCode"];
    const transactionId = vnpParams["vnp_TxnRef"];
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      throw new Error("Payment not found for transactionId: " + transactionId);
    }

    const orderId = payment.orderId; // Use orderId from Payment document

    if (vnpResponseCode === "00") {
      // Update payment status
      payment.status = "completed";
      payment.vnpayResponse = vnpParams;
      await payment.save();

      // Update order status
      const order = await Order.findById(orderId);
      if (order) {
        order.status = "Delivered";
        order.paymentStatus = "completed";
        await order.save();

        // Update revenue report
        let revenueReport = await Report.findOne({ type: "total_revenue" });
        if (!revenueReport) {
          revenueReport = new Report({
            type: "total_revenue",
            data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
          });
        }
        revenueReport.data.totalRevenue.total += order.totalAmount;
        revenueReport.data.totalRevenue.lastUpdated = new Date();
        await revenueReport.save();
      }

      return res.redirect(`${frontendUrl}/payment-success?orderId=${orderId}`);
    } else {
      payment.status = "failed";
      payment.vnpayResponse = vnpParams;
      await payment.save();
      return res.redirect(`${frontendUrl}/payment-fail?orderId=${orderId}`);
    }
  } catch (error) {
    console.error("❌ handleVnpayReturn Error:", error);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-error`);
  }
},

  checkVnpayPaymentStatus: async (req, res) => {
    try {
      const { vnp_TxnRef } = req.params;
      const payment = await Payment.findOne({ transactionId: vnp_TxnRef });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found.",
        });
      }

      res.json({
        success: true,
        status: payment.status,
        orderId: payment.orderId,
      });
    } catch (error) {
      console.error("Error checking VNPay status:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  handleSuccess: async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    renderSuccessPage(res, frontendUrl);
  },
};

export default paymentController;