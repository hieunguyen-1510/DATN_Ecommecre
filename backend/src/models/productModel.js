import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Giá bán
    purchasePrice: { type: Number, required: true, min: 0 }, // Giá mua
    discountPercentage: { type: Number, min: 0, max: 100 },
    discountAmount: { type: Number, min: 0 },
    discountExpiry: Date,
    discountCode: String,
    finalPrice: { type: Number, min: 0 }, 
    finalPrice: { type: Number, min: 0 }, // Giá sau khi áp dụng giảm giá
    image: { type: [String], default: [] }, 
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], default: [] }, 
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0, min: 0 },
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
    averageDailySales: {  // Trung bình bán hàng ngày 
      type: Number,
      default: 0
    },
    soldCount: { type: Number, default: 0 }, // Tổng số lượng đã bán
    isClearance: { type: Boolean, default: false }, // Đánh dấu sản phẩm xả kho
    discount: { type: Number, default: 0 }, // Giảm giá riêng cho xả kho
    lastSoldAt: { type: Date }, // Ngày bán gần nhất
    lastSoldDate: Date,  // Ngày bán cuối cùng
    clearanceGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'ClearanceGroup' },
    stockStatus: {  
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

// Cập nhật pre-save hook để tính finalPrice
productSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('discountPercentage') || this.isModified('discountAmount')) {
    if (this.discountPercentage) {
      this.finalPrice = this.price * (1 - this.discountPercentage / 100);
    } else if (this.discountAmount) {
      this.finalPrice = this.price - this.discountAmount;
    } else {
      this.finalPrice = this.price;
    }
  }

  // Cập nhật stockStatus như hiện tại
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