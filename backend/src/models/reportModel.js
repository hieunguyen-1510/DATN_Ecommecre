import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["product_status", "order_stats", "bestseller", "stock_status", "inventory_alert","total_revenue"],
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
        alert: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryTransaction" },
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
     totalRevenue: { 
      total: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d", 
  },
}, { versionKey: false });

const Report = mongoose.models.Report || mongoose.model("Report",reportSchema);
export default Report;