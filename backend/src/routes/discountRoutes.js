import express from 'express';
import { 
    createDiscount, 
    getDiscounts, 
    applyDiscount,
    updateDiscount,
    deleteDiscount
} from '../controllers/discountController.js';
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import { getDiscountById } from '../controllers/discountController.js';

const discountRouter = express.Router();

// ADMIN ROUTES
discountRouter.post('/', authUser, adminAuth, createDiscount);
discountRouter.put('/:id', authUser, adminAuth, updateDiscount);
discountRouter.delete('/:id', authUser, adminAuth, deleteDiscount);

// USER ROUTES
discountRouter.get('/', authUser, getDiscounts);
discountRouter.post('/apply', authUser, applyDiscount);
// GET Discount by id
discountRouter.get('/:id', authUser, getDiscountById);

export default discountRouter;