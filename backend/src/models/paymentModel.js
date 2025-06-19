import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    method: {
      type: String,
      enum: ["COD", "MOMO", "PAYPAL"],
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

    // MOMO
    momo: {
      orderId: { type: String, index: true, sparse: true },
      request: { type: Object, default: {} },
      response: { type: Object, default: {} },
    },

    // PAYPAL
    paypal: {
      orderId: { type: String, index: true, sparse: true },
      payerId: { type: String, index: true, sparse: true },
      captureId: { type: String, index: true, sparse: true },
      response: { type: Object, default: {} },
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
