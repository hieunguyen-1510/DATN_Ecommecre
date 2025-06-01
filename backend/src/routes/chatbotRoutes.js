import express from "express";
import { handleChatMessage, getChatHistory } from "../controllers/chatbotController.js";
import authUser from "../middleware/auth.js";

const chatbotRouter = express.Router();

chatbotRouter.post('/message', authUser, handleChatMessage);
chatbotRouter.get('/history', authUser, getChatHistory);

export default chatbotRouter;