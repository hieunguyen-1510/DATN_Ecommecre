import express from "express";
import { createReview, getReviews, updateReviewStatus, deleteReview } from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.post('/', createReview);
reviewsRouter.get('/', getReviews);
reviewsRouter.put('/:id', updateReviewStatus);  
reviewsRouter.delete('/:id', deleteReview);     


export default reviewsRouter;