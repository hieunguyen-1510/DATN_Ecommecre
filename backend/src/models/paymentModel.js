import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String, 
      required: true,
      index: true,
    },
    // If orderId is a strict MongoDB ObjectId:
    // orderId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Order",
    //   required: true,
    //   index: true,
    // },
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
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    momoOrderId: { 
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    momoRequest: {
      type: Object,
      default: {},
    },
    momoResponse: {
      type: Object,
      default: {},
    },
    refundDetails: {
      type: Object,
      default: null,
    },
    vnpTransactionDate: {
      type: String,
      index: true,
    },
    vnpayResponse: { 
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;