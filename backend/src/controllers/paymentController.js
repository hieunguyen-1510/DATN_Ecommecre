import { 
  createMomoPayment as momoServiceCreate, 
  handleMomoIPN as momoServiceIPN, 
  checkStatusPayment 
} from "../services/momo.Service.js";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

const paymentController = {
  handleMomoIPN: async (req, res) => {
    try {
      const data = req.body;
      const result = await momoServiceIPN(data);
      res.status(200).json({ message: "IPN processed successfully", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

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
        orderData 
      });
      
      res.status(200).json(result);
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
          message: "Không tìm thấy giao dịch" 
        });
      }

      const statusData = await checkStatusPayment({ momoOrderId });
      
      payment.status = statusData.resultCode === 0 ? "completed" : "failed";
      payment.momoResponse = statusData;
      await payment.save();

      res.json({ 
        success: true, 
        status: payment.status,
        orderId: payment.orderId 
      });
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái MoMo:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
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
          momoOrderId: payment.momoOrderId || ''
        });
        
        payment.status = statusResult.resultCode === 0 ? "completed" : "failed";
        await payment.save();

        if (statusResult.resultCode === 0) {
          await Order.findByIdAndUpdate(
            payment.orderId,
            {
              status: "paid",
              paymentStatus: "completed",
            },
            { new: true }
          ).populate('items.productId');
        }
      }

      res.status(200).json({ status: payment.status });
    } catch (error) {
      res.status(500).json({ 
        message: "Lỗi kiểm tra trạng thái thanh toán",
        error: error.message 
      });
    }
  },

  // Các method khác giữ nguyên
  createVnpayPayment: async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  },

  handleVnpayIPN: async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  },

  handleSuccess: async (req, res) => {
    res.status(200).json({ message: "Payment Success Page (Client Side)" });
  },
};

export default paymentController;