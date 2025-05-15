import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      // ID đơn hàng trong DB 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    method: {
      type: String,
      enum: ["COD", "MOMO", "VNPAY"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true,
    },
    transactionId: {
      // ID dùng để tra cứu giao dịch bên MoMo
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    momoOrderId: {
      // orderId bạn gửi cho MoMo 
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    momoRequest: {
      // Lưu payload gửi lên MoMo
      type: Object,
      default: {},
    },
    momoResponse: {
      // Lưu response trả về từ MoMo
      type: Object,
      default: {},
    },
    refundDetails: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
