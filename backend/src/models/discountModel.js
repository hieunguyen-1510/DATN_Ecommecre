import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true,
    index: true // Tối ưu tìm kiếm
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed_amount"],
    required: true
  },
  value: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(value) {
        if (this.discountType === "percentage") {
          return value >= 1 && value <= 100;
        }
        return value >= 1;
      },
      message: "Giá trị không hợp lệ: Phần trăm (1-100%) hoặc số tiền tối thiểu 1"
    }
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: [] // Áp dụng cho tất cả nếu mảng rỗng
  }],
  minOrderValue: {
    type: Number,
    min: 0
  },
  startDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(endDate) {
        return endDate > this.startDate;
      },
      message: "Ngày kết thúc phải sau ngày bắt đầu"
    }
  },
  usageLimit: { 
    type: Number, 
    min: 1 
  },
  usedCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    default: "active",
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Tự động cập nhật trạng thái
discountSchema.pre("save", function(next) {
  const now = new Date();
  if (this.endDate < now && this.status !== "expired") {
    this.status = "expired";
  }
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    this.status = "inactive";
  }
  next();
});

// Đánh index cho các trường thường query
discountSchema.index({ code: 1, status: 1, endDate: 1 });

const Discount = mongoose.models.Discount || mongoose.model("Discount", discountSchema);
export default Discount;