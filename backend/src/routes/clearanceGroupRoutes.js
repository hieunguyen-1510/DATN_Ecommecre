import express from "express";
import { createClearanceGroup, applyClearanceGroup, getAllClearanceGroups } from "../controllers/clearanceController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const clearanceRouter = express.Router();

// Lấy danh sách các nhóm xả kho
clearanceRouter.get('/', authUser, adminAuth, getAllClearanceGroups);

// Tạo nhóm xả kho mới 
clearanceRouter.post('/', authUser, adminAuth, createClearanceGroup);

// Ap dụng nhóm xả kho cho các sản phẩm đã chọn
clearanceRouter.post('/:groupId/apply', authUser, adminAuth, applyClearanceGroup);

export default clearanceRouter;