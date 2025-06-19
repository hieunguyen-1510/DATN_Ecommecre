import {
  createMomoPayment as momoServiceCreate,
  handleMomoIPN as momoServiceIPN,
  checkStatusPayment,
} from "../services/momo.Service.js";

import {
  createOrder as paypalServiceCreate,
  captureOrder as paypalServiceCapture,
  getOrderDetails as paypalServiceGetDetails,
} from "../services/paypal.service.js";

import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import Report from "../models/reportModel.js";
import mongoose from "mongoose";

// Success Momo
const renderSuccessPage = (res, frontendUrl) => {
  res.send(`
    <html>
      <head><title>Thanh toán thành công</title></head>
      <body>
        <div style="font-family: Arial; text-align: center; padding: 50px;">
          <h2 style="color: green;">🎉 Cảm ơn bạn đã mua hàng!</h2>
          <a href="${frontendUrl}" style="padding: 10px 20px; background: green; color: white; text-decoration: none; border-radius: 5px;">Quay lại trang chủ</a>
        </div>
      </body>
    </html>
  `);
};

const paymentController = {
  // Tạo thanh toán MoMo
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
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Xử lý IPN từ MoMo
  handleMomoIPN: async (req, res) => {
    try {
      const result = await momoServiceIPN(req.body);

      if (result.status === "completed") {
        const order = await Order.findById(result.orderId);
        const payment = await Payment.findOne({ orderId: result.orderId });

        if (order && payment) {
          // Cập nhật trạng thái thanh toán
          payment.status = "completed";
          payment.momo.response = result.response || {};
          await payment.save();

          // Cập nhật trạng thái đơn hàng
          if (order.status === "pending") {
            order.status = "Processing";
          }

          order.paymentStatus = "completed";
          await order.save();

          // Cập nhật báo cáo doanh thu
          let report = await Report.findOne({ type: "total_revenue" });
          if (!report) {
            report = new Report({
              type: "total_revenue",
              data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
            });
          }

          report.data.totalRevenue.total += order.totalAmount;
          report.data.totalRevenue.lastUpdated = new Date();
          await report.save();
        }
      }

      res.status(200).json({ message: "IPN processed", result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Người dùng quay lại từ redirect MoMo
  handleMomoReturn: async (req, res) => {
    try {
      const { resultCode, orderId } = req.query;
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      if (resultCode === "0") {
        renderSuccessPage(res, frontendUrl);
      } else {
        return res.redirect(`${frontendUrl}/payment-fail?orderId=${orderId}`);
      }
    } catch (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }
  },

  // Kiểm tra trạng thái MoMo bằng orderId
  checkMomoPaymentStatus: async (req, res) => {
    try {
      const { momoOrderId } = req.params;
      const payment = await Payment.findOne({ "momo.orderId": momoOrderId });
      if (!payment) {
        return res.status(404).json({ message: "Không tìm thấy giao dịch" });
      }

      const statusData = await momoServiceCheck({ momoOrderId });
      payment.status = statusData.resultCode === 0 ? "completed" : "failed";
      payment.momo.response = statusData;
      await payment.save();

      if (statusData.resultCode === 0) {
        const order = await Order.findById(payment.orderId);
        if (order) {
          if (order.status === "pending") {
            order.status = "Processing";
          }
          order.paymentStatus = "completed";
          await order.save();

          let report = await Report.findOne({ type: "total_revenue" });
          if (!report) {
            report = new Report({
              type: "total_revenue",
              data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
            });
          }
          report.data.totalRevenue.total += order.totalAmount;
          report.data.totalRevenue.lastUpdated = new Date();
          await report.save();
        }
      }

      res.json({
        success: true,
        status: payment.status,
        orderId: payment.orderId,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Kiểm tra theo orderId
  checkStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const payment = await Payment.findOne({ orderId });

      if (!payment) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      // ---------------- Xử lý MOMO ----------------
      if (payment.method === "MOMO" && payment.status === "pending") {
        const statusResult = await momoServiceCheck({ paymentId: payment._id });
        payment.status = statusResult.resultCode === 0 ? "completed" : "failed";
        await payment.save();

        if (statusResult.resultCode === 0) {
          const order = await Order.findById(payment.orderId);
          if (order) {
            if (order.status === "pending") {
              order.status = "Processing";
            }
            order.paymentStatus = "completed";
            await order.save();

            let report = await Report.findOne({ type: "total_revenue" });
            if (!report) {
              report = new Report({
                type: "total_revenue",
                data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
              });
            }
            report.data.totalRevenue.total += order.totalAmount;
            report.data.totalRevenue.lastUpdated = new Date();
            await report.save();
          }
        }
      }

      // ---------------- Xử lý PAYPAL ----------------
      if (payment.method === "PAYPAL" && payment.status === "pending") {
        const paypalOrder = await paypalServiceGetDetails(
          payment.paypal.orderId
        );

        // if (paypalOrder.status === "COMPLETED") {
        //   payment.status = "completed";
        //   await payment.save();

        //   const order = await Order.findById(payment.orderId);
        //   if (order) {
        //     order.status = "Delivered";
        //     order.paymentStatus = "completed";
        //     await order.save();
        if (paypalOrder.status === "COMPLETED") {
          payment.status = "completed";
          await payment.save();

          const order = await Order.findById(payment.orderId);
          if (order) {
            if (order.status === "pending") {
              order.status = "Processing";
            }
            order.paymentStatus = "completed";
            await order.save();

            let report = await Report.findOne({ type: "total_revenue" });
            if (!report) {
              report = new Report({
                type: "total_revenue",
                data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
              });
            }

            report.data.totalRevenue.total += order.totalAmount;
            report.data.totalRevenue.lastUpdated = new Date();
            await report.save();
          }
        } else {
          payment.status = "failed";
          await payment.save();
        }
      }
      res.status(200).json({ status: payment.status });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Tạo đơn PayPal
  createPaypalOrder: async (req, res) => {
    try {
      console.log("➡️ [createPaypalOrder] BODY nhận từ client:", req.body);

      const { amount, orderId } = req.body;
      console.log("💡 amount:", amount);
      console.log("💡 orderId:", orderId);

      if (!amount || !orderId) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu thông tin đơn hàng." });
      }

      // const objectId = new mongoose.Types.ObjectId(orderId);

      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng." });
      }

      // const paypalOrder = await paypalServiceCreate(amount, {
      //   orderId,
      //   cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      // });

      console.log("📤 Gửi sang paypalServiceCreate với:", {
        amount,
        orderId,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      });

      const paypalOrder = await paypalServiceCreate(amount, {
        orderId: orderId,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      });

      // Lưu thông tin
      await Payment.create({
        orderId: new mongoose.Types.ObjectId(orderId),
        method: "PAYPAL",
        amount,
        status: "pending",
        transactionId: paypalOrder.id,
        paypal: {
          orderId: paypalOrder.id,
          response: paypalOrder,
        },
      });

      res.json(paypalOrder);
    } catch (err) {
      console.error("Lỗi tạo đơn hàng PayPal:", err);
      res.status(500).json({ message: "Lỗi tạo đơn hàng PayPal" });
    }
  },

  // Capture đơn hàng PayPal
  capturePaypalOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const result = await paypalServiceCapture(orderId);
      res.json(result);
    } catch (err) {
      console.error("Lỗi capture đơn hàng PayPal:", err);
      res.status(500).json({ message: "Lỗi capture đơn hàng PayPal" });
    }
  },

  checkPaypalPaymentStatus: async (req, res) => {
    try {
      const { paypalOrderId } = req.params;

      const payment = await Payment.findOne({
        "paypal.orderId": paypalOrderId,
      });

      if (!payment) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy giao dịch PayPal" });
      }

      const result = await paypalServiceGetDetails(paypalOrderId);

      if (result.status === "COMPLETED") {
        payment.status = "completed";
      } else {
        payment.status = "failed";
      }

      payment.paypal.response = result;
      await payment.save();

      const order = await Order.findById(payment.orderId);
      // if (order && result.status === "COMPLETED") {
      //   order.status = "Delivered";
      //   order.paymentStatus = "completed";
      //   await order.save();
      // }

      if (order && result.status === "COMPLETED") {
        if (order.status === "pending") {
          order.status = "Processing";
        }
        order.paymentStatus = "completed";
        await order.save();
      }

      res
        .status(200)
        .json({ status: payment.status, orderId: payment.orderId });
    } catch (err) {
      console.error("Lỗi check Paypal status:", err);
      res.status(500).json({ message: "Lỗi kiểm tra trạng thái PayPal" });
    }
  },

  // Trang success
  handleSuccess: async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const { token, PayerID } = req.query;
    console.log("query ", req.query);

    try {
      if (!token || !PayerID) {
        return res.redirect(`${frontendUrl}/payment-fail`);
      }

      // Capture thanh toán từ PayPal
      const result = await paypalServiceCapture(token);

      // Tìm payment theo transactionId (tức token)
      const payment = await Payment.findOne({ transactionId: token });
      console.log("log payment:", payment);

      if (!payment) {
        console.error("Không tìm thấy thông tin payment theo token:", token);
        return res.redirect(`${frontendUrl}/payment-fail`);
      }

      // Cập nhật thông tin payment
      payment.status = "completed";
      payment.paypal.payerId = PayerID;
      payment.paypal.captureId =
        result?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "";
      payment.paypal.response = result;
      await payment.save();

      // Cập nhật thông tin đơn hàng
      const order = await Order.findById(payment.orderId);
      // if (order) {
      //   order.status = "Delivered";
      //   order.paymentStatus = "completed";
      //   await order.save();
      // }
      if (order) {
        if (order.status === "pending") {
          order.status = "Processing";
        }
        order.paymentStatus = "completed";
        await order.save();
      }

      // Cập nhật báo cáo doanh thu
      let report = await Report.findOne({ type: "total_revenue" });
      if (!report) {
        report = new Report({
          type: "total_revenue",
          data: {
            totalRevenue: {
              total: 0,
              lastUpdated: new Date(),
            },
          },
        });
      }

      report.data.totalRevenue.total += order.totalAmount;
      report.data.totalRevenue.lastUpdated = new Date();
      await report.save();

      // Success Paypal
      res.redirect(`${frontendUrl}/payment-success?orderId=${order._id}`);
    } catch (err) {
      console.error("Lỗi khi xử lý Paypal:", err);
      res.redirect(`${frontendUrl}/payment-fail`);
    }
  },
};

export default paymentController;
