import mongoose from "mongoose";

const cartHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: String,
  action: { type: String, enum: ["add", "remove", "update"], required: true },
  quantity: Number,
  timestamp: { type: Date, default: Date.now },
});

const CartHistory = mongoose.models.CartHistory ||mongoose.model("CartHistory", cartHistorySchema);
export default CartHistory;
