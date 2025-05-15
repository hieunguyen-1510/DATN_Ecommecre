import Payment from "../models/paymentModel.js";

export const verifyPaymentStatus = async (req, res, next) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });

  const payment = await Payment.findOne({ orderId });
  if (payment && payment.status === 'completed') {
    return res.status(400).json({ message: "Đơn hàng đã được thanh toán" });
  }

  next();
};
