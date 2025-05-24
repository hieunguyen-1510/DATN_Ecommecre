import mongoose from "mongoose";

const inventoryAlertSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product",
    required: true 
  },
  currentStock: Number,
  daysToEmpty: Number,  // Số ngày dự kiến hết hàng
  alertLevel: {  // Mức độ ưu tiên cảnh báo (1: thấp, 2: trung bình, 3: cao)
    type: Number,
    min: 1,
    max: 3,
    default: 1
  },
  recommendedActions: [{
    action: {
      type: String,
      enum: ["restock", "discount", "bundle", "promote", "liquidate"],
      required: true
    },
    parameters: {
      discountPercentage: Number,
      bundleWith: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    }
  }],
  notes: [{
    content: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }]
}, { timestamps: true });

// Virtuals
inventoryAlertSchema.virtual('productDetails', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id',
  justOne: true
});

const InventoryAlert = mongoose.models.InventoryAlert ||  mongoose.model("InventoryAlert", inventoryAlertSchema);

export default InventoryAlert;