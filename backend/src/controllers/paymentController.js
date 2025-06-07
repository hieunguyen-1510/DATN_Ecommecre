import {
  createMomoPayment as momoServiceCreate,
  handleMomoIPN as momoServiceIPN,
  checkStatusPayment,
} from "../services/momo.Service.js";

import {
  createVnpayPayment as vnpayServiceCreate,
  handleVnpayIPN as vnpayServiceIPN, 
} from "../services/vnpay.Service.js"; 

import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import Report from "../models/reportModel.js";

const paymentController = {

  createMomoPayment: async (req, res) => {
    try {
      const { orderId, amount, orderInfo, orderData } = req.body;

      if (!orderId || !amount || !orderInfo) {
        return res.status(400).json({ message: "Thiếu thông tin đầu vào" });
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

      // Kiểm tra kết quả từ MoMo
      if (result.resultCode === 0) {
        const { orderId } = data;

        // Tìm Payment và Order
        const payment = await Payment.findOne({ orderId });
        if (!payment) {
          return res.status(404).json({ message: "Không tìm thấy thông tin thanh toán" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Cập nhật trạng thái
        payment.status = "completed";
        payment.momoResponse = result;
        await payment.save();

        order.status = "Delivered"; 
        order.paymentStatus = "completed";
        await order.save();

        // Cộng doanh thu
        let revenueReport = await Report.findOne({ type: "total_revenue" });
        if (!revenueReport) {
          revenueReport = new Report({ type: "total_revenue", data: { totalRevenue: { total: 0, lastUpdated: new Date() } } });
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

  checkMomoPaymentStatus: async (req, res) => {
    try {
      const { momoOrderId } = req.params;
      const payment = await Payment.findOne({ momoOrderId });
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giao dịch",
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

          // Cộng doanh thu
          let revenueReport = await Report.findOne({ type: "total_revenue" });
          if (!revenueReport) {
            revenueReport = new Report({ type: "total_revenue", data: { totalRevenue: { total: 0, lastUpdated: new Date() } } });
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
      console.error("Lỗi kiểm tra trạng thái MoMo:", error);
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
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      if (payment.method === "MOMO" && payment.status === "pending") {
        const statusResult = await checkStatusPayment({
          momoOrderId: payment.momoOrderId || "",
        });

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

          // Cộng doanh thu
          let revenueReport = await Report.findOne({ type: "total_revenue" });
          if (!revenueReport) {
            revenueReport = new Report({ type: "total_revenue", data: { totalRevenue: { total: 0, lastUpdated: new Date() } } });
          }
          revenueReport.data.totalRevenue.total += order.totalAmount;
          revenueReport.data.totalRevenue.lastUpdated = new Date();
          await revenueReport.save();
        }
      }

      res.status(200).json({ status: payment.status });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi kiểm tra trạng thái thanh toán",
        error: error.message,
      });
    }
  },

 // create VnpayPayment
  createVnpayPayment: async (req, res) => {
    try {
      const { amount, orderInfo, bankCode } = req.body;
      const ipAddr = req.ip || req.connection.remoteAddress; // Lấy địa chỉ IP của client

      if (!amount || !orderInfo) {
        return res.status(400).json({ message: "Thiếu thông tin đầu vào" });
      }

      // Gọi service để tạo URL thanh toán VNPay
      const paymentUrl = await vnpayServiceCreate({
        amount,
        orderInfo,
        bankCode,
        ipAddr,
      });

      res.status(200).json({ paymentUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

 // handle VnpayIPN
  handleVnpayIPN: async (req, res) => {
    try {
      const query = req.query;
      const result = await vnpayServiceIPN(query);

      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy thông tin giao dịch" });
      }

      if (result.RspCode === "00") { // Thanh toán thành công
        const orderId = query.vnp_TxnRef;

        const payment = await Payment.findOne({ orderId });
        if (!payment) {
          return res.status(404).json({ message: "Không tìm thấy thông tin thanh toán" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        payment.status = "completed";
        payment.vnpayResponse = query;
        await payment.save();

        order.status = "Delivered";
        order.paymentStatus = "completed";
        await order.save();

        let revenueReport = await Report.findOne({ type: "total_revenue" });
        if (!revenueReport) {
          revenueReport = new Report({ type: "total_revenue", data: { totalRevenue: { total: 0, lastUpdated: new Date() } } });
        }
        revenueReport.data.totalRevenue.total += order.totalAmount;
        revenueReport.data.totalRevenue.lastUpdated = new Date();
        await revenueReport.save();
      }

      // Trả về phản hồi cho VNPay
      res.status(200).json({ message: "IPN processed successfully", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // checkVnpayPaymentStatus
  checkVnpayPaymentStatus: async (req, res) => {
    try {
      const {vnp_TxnRef} = req.params;
      const payment = await Payment.findOne({transactionId: vnp_TxnRef});

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giao dịch."
        });
      }

      if (payment.status === "completed") {
        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = "Delivered";
          order.paymentStatus = "completed";
          order.save();

          let revenueReport = await Report.findOne({ type: "total_revenue" });
          if (!revenueReport) {
          revenueReport = new Report({ type: "total_revenue", data: { totalRevenue: { total: 0, lastUpdated: new Date() } } });
          }
          revenueReport.data.totalRevenue.total += order.totalAmount;
          revenueReport.data.totalRevenue.lastUpdated = new Date();
          await revenueReport.save();
        }
      }
      res.json({
        success: true,
        status: payment.status,
        orderId: payment.orderId
      })
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái VNPay:", error);
      res.status(500).json({
        success: false,
        message: `Lỗi kiểm tra trạng thái VNPay: ${error.message}`,
    });
    }
  },

  handleSuccess: async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

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
            color: #2f855a; /* màu xanh lá */
            margin-bottom: 24px;
            font-weight: 700;
          }
          a {
            display: inline-block;
            padding: 12px 30px;
            background-color: #38a169; /* xanh lá đậm */
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
  },
};

export default paymentController;
