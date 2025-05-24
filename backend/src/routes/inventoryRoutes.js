import express from 'express';
import {
  getInventoryDashboard,
  getStockAlerts,
  updateStock,
  searchProducts,
  createDiscount,
  applyProductDiscount
} from '../controllers/inventoryController.js';
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const inventoryRouter = express.Router();

// Public routes
inventoryRouter.get('/dashboard', getInventoryDashboard);
inventoryRouter.get('/alerts', getStockAlerts);
inventoryRouter.get('/search', searchProducts);

// Authenticated routes
inventoryRouter.put('/:id/stock', authUser, updateStock);

// Admin routes
inventoryRouter.post('/discounts', authUser, adminAuth, createDiscount);
inventoryRouter.post('/:productId/apply-discount', authUser, applyProductDiscount);

export default inventoryRouter;