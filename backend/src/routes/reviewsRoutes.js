import express from "express";
import { createReview, getReviews, updateReviewStatus, deleteReview } from "../controllers/reviewsController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const reviewsRouter = express.Router();

reviewsRouter.get('/', getReviews);
reviewsRouter.post('/', authUser, createReview);
// reviewsRouter.get('/', authUser,adminAuth, getReviews);
reviewsRouter.put('/:id',authUser,adminAuth, updateReviewStatus);  
reviewsRouter.delete('/:id',authUser,adminAuth, deleteReview);     


export default reviewsRouter;