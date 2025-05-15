import mongoose from "mongoose";

const inventoryAlertSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  currentStock: {
    type: Number,
    required: true,
  },
  threshold: {
    type: Number,
    required: true, // Số lượng tối thiểu để không bị cảnh báo
  },
  daysInStock: {
    type: Number,
    required: true,
  },
  lastSoldDate: {
    type: Date,
    default: null,
  },
  recommendedAction: {
    type: String,
    enum: ["discount", "liquidate", "none"],
    default: "none",
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  note: {
    type: String,
    default: "", // ghi chú tùy chỉnh nếu có
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InventoryAlert = mongoose.models.InventoryAlert || mongoose.model("InventoryAlert", inventoryAlertSchema);
export default InventoryAlert;
