import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  address: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "VNPAY", "MOMO"], required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 }, 
  status: { type: String, default: "Chờ xử lý" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order ||mongoose.model("Order", orderSchema);

export default Order;