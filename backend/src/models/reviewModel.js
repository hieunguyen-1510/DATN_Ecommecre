import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
