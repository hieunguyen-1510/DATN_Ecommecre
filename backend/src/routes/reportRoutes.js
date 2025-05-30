import express from "express";

import {
  generateOrderStatsReport,
  generateStockStatusReport,
  getDynamicReport,
  getOrderTimeStats,
  getInventoryStats,
  getBestSellersByQuantity,
  getBestSellersByRevenue,
  getTotalRevenue,
} from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/order-stats", generateOrderStatsReport);
reportRouter.get("/stock-status", generateStockStatusReport);
reportRouter.get("/time-stats", getOrderTimeStats);
reportRouter.get("/inventory-stats", getInventoryStats);
reportRouter.get("/total-revenue", getTotalRevenue);

reportRouter.get("/", getDynamicReport);

reportRouter.get("/best-sellers/quantity", getBestSellersByQuantity);

reportRouter.get("/best-sellers/revenue", getBestSellersByRevenue);

export default reportRouter;
