import express from "express";

import {
  generateOrderStatsReport,
  generateStockStatusReport,
  getDynamicReport,
  getOrderTimeStats,
  getInventoryStats,
  getBestSellers,
  getTotalRevenue

} from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/order-stats", generateOrderStatsReport);
reportRouter.get("/stock-status", generateStockStatusReport);
reportRouter.get("/time-stats", getOrderTimeStats);
reportRouter.get("/", getDynamicReport); 
reportRouter.get("/inventory-stats", getInventoryStats);
reportRouter.get("/best-sellers", getBestSellers);
reportRouter.get("/total-revenue", getTotalRevenue);

export default reportRouter;
