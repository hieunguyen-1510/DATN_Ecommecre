import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], default: [] }, 
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], default: [] }, 
    stock: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "out_of_stock", "hidden"], 
      default: "active",
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;