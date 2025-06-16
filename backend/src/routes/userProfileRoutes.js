import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userProfileController.js";
import authUser from "../middleware/auth.js";

const userProfileRouter = express.Router();

// GET profile
userProfileRouter.get('/', authUser, getUserProfile);

// PUT profile
userProfileRouter.put('/', authUser, updateUserProfile);

export default userProfileRouter;