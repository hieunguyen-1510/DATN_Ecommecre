import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["product_status", "order_stats", "bestseller", "stock_status", "inventory_alert"],
  },
  data: {
    inventoryStats: {
      totalProducts: { type: Number, default: 0 },
      totalInStock: { type: Number, default: 0 },
      averageStock: { type: Number, default: 0 },
      stockBreakdown: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          stock: Number,
          stockStatus: String,
          lastSoldDate: Date,
        },
      ],
    },
    bestSellers: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        sold: Number,
        stock: Number,
      },
    ],
    inventoryAlerts: [
      {
        alert: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryAlert" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        currentStock: Number,
        alertLevel: Number,
        recommendedActions: [
          {
            action: String,
            parameters: {
              discountPercentage: Number,
              bundleWith: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            },
          },
        ],
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d", // Auto-delete after 1 day
  },
}, { versionKey: false });

// Index for faster queries
reportSchema.index({ type: 1 });

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export default Report;