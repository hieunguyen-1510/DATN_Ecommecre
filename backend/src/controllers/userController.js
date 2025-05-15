import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import Role from "../models/roleModel.js"; 
import bcrypt from "bcryptjs";

// GET danh sách user
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password").populate({
      path: "role",
      select: "name", // Chỉ lấy name
    });
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// GET detail user bằng ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id, "-password").populate("role");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// create user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Validate role ID
    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ message: "ID vai trò không hợp lệ!" });
    }

    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res.status(400).json({ message: "Vai trò không tồn tại!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id,
    });

    // Populate role để trả về thông tin
    await newUser.populate("role");

    res.status(201).json({
      message: "Thêm thành công!",
      data: { ...newUser.toObject(), password: undefined },
    });
  } catch (err) {
    console.error("Lỗi khi tạo user:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
    }

    let updateData = { name, email };

    if (role) {
      // Validate role ID
      if (!mongoose.Types.ObjectId.isValid(role)) {
        return res.status(400).json({ message: "ID vai trò không hợp lệ!" });
      }

      const roleDoc = await Role.findById(role);
      if (!roleDoc) {
        return res.status(400).json({ message: "Vai trò không tồn tại!" });
      }
      updateData.role = roleDoc._id;
    }

    // Cập nhật user
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password")
      .populate("role");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.status(200).json({
      message: "Cập nhật thành công!",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật user:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


// delete user
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


export { getAllUsers, getUserById, createUser, updateUser, deleteUser};