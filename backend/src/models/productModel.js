import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Giá bán
    purchasePrice: { type: Number, required: true, min: 0 }, // Giá mua

    // Giảm giá
    discountPercentage: { type: Number, min: 0, max: 100 },
    discountAmount: { type: Number, min: 0 },
    discountExpiry: Date,
    discountCode: String,
    finalPrice: { type: Number, min: 0 }, // Giá sau khi áp dụng giảm giá

    // Thông tin sản phẩm
    image: { type: [String], default: [] },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 0 },

    // Tồn kho và bán hàng
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    bestseller: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 },
    lastSoldAt: { type: Date },
    lastSoldDate: { type: Date },

    // Trạng thái và tồn kho nâng cao
    status: {
      type: String,
      enum: ["active", "out_of_stock", "hidden"],
      default: "active",
    },
    stockThreshold: { type: Number, default: 10, min: 0 },
    overstockThreshold: { type: Number, default: 100, min: 0 },
    averageDailySales: { type: Number, default: 0 },
    stockStatus: {
      type: String,
      enum: ["normal", "low", "critical", "overstock"],
      default: "normal",
    },

    // Xả kho
    isClearance: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    clearanceGroup: { type: mongoose.Schema.Types.ObjectId, ref: "ClearanceGroup" },

    // Đánh giá
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook
productSchema.pre("save", function (next) {
  if (
    this.isModified("price") ||
    this.isModified("discountPercentage") ||
    this.isModified("discountAmount")
  ) {
    if (this.discountPercentage) {
      this.finalPrice = this.price * (1 - this.discountPercentage / 100);
    } else if (this.discountAmount) {
      this.finalPrice = this.price - this.discountAmount;
    } else {
      this.finalPrice = this.price;
    }
  }

  // Update stockStatus & status
  if (this.isModified("stock")) {
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
