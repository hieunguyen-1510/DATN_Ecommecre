import express from "express";
import { getCustomerRanks } from "../controllers/customerController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const customerRouter = express.Router();

customerRouter.get('/customers',authUser, adminAuth, getCustomerRanks);

export default customerRouter;