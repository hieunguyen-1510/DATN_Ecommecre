import express from "express";
import {addToCart, clearCart, getCartHistory, getUserCart, updateCart} from "../controllers/cartController.js";
import auth from '../middleware/auth.js';
const cartRouter = express.Router();

// GET user cart
cartRouter.get('/get',auth,getUserCart);

//Add to cart
cartRouter.post('/add',auth,addToCart);

// Update cart
cartRouter.post('/update',auth,updateCart);

//  Cart History
cartRouter.get('/history',auth, getCartHistory);

// Clear cart
cartRouter.delete('/clear',auth, clearCart);

export default cartRouter;