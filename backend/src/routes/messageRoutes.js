import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const messageRouter = express.Router();

// Gui tin nhan
messageRouter.post("/send", authUser, adminAuth, sendMessage);
// lay lich su tin nhan
messageRouter.get("/history", authUser, adminAuth, getMessages);

export default messageRouter;
