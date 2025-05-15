import express from "express";
import { getAllUsers, getUserById,createUser,updateUser, deleteUser} from "../controllers/userController.js";

const userListRouter = express.Router();
// GET danh sách user
userListRouter.get("/", getAllUsers);

// GET user bằng ID
userListRouter.get("/:id", getUserById);

// POST thêm user mới
userListRouter.post("/", createUser);

// PUT cập nhật user 
userListRouter.put("/:id", updateUser);

// DELETE xoá user
userListRouter.delete("/:id", deleteUser);

export default userListRouter;
