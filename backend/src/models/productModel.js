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
     stock: { 
      type: Number, 
      default: 0,
      min: 0
    },
    stockThreshold: {  // Ngưỡng cảnh báo tồn kho thấp
      type: Number,
      default: 10,
      min: 0
    },
    overstockThreshold: {  // Ngưỡng cảnh báo tồn kho nhiều
      type: Number,
      default: 100,
      min: 0
    },
    averageDailySales: {  // Trung bình bán hàng ngày (tính toán tự động)
      type: Number,
      default: 0
    },
    lastSoldDate: Date,  // Ngày bán cuối cùng
    stockStatus: {  // Trạng thái tự động
      type: String,
      enum: ["normal", "low", "critical", "overstock"],
      default: "normal"
    },
    discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  discountAmount: {
    type: Number,
    min: 0
  },
  discountExpiry: Date,
  discountCode: String,
  },
  
  { timestamps: true }
);

// Thêm pre-save hook để tự động cập nhật trạng thái
productSchema.pre('save', function(next) {
  if (this.isModified('stock')) {
    if (this.stock <= 0) {
      this.stockStatus = "critical";
      this.status = "out_of_stock";
    } else if (this.stock < this.stockThreshold * 0.3) {
      this.stockStatus = "critical";
    } else if (this.stock < this.stockThreshold) {
      this.stockStatus = "low";
    } else if (this.stock > this.overstockThreshold) {
      this.stockStatus = "overstock";
    } else {
      this.stockStatus = "normal";
    }
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;