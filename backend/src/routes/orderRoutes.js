import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  getOrderDetail,
  cancelOrder,
  getOrderStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.get('/all', authUser, adminAuth, allOrders);
orderRouter.post("/status", authUser, adminAuth, updateStatus);

// Get order detail
orderRouter.get("/detail/:orderId", authUser, getOrderDetail);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);

// User Features
orderRouter.get("/user-orders", authUser, userOrders);

// GET order status user
orderRouter.get("/:orderId/status", authUser, getOrderStatus);

// Cancel order
orderRouter.put("/cancel/:orderId", authUser, cancelOrder);

export default orderRouter;
