import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    // Không cần decode lại token, sử dụng từ authUser
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Chưa xác thực người dùng" });
    }

    // Kiểm tra quyền truy cập
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập API này." });
    }

    // Kiểm tra admin có tồn tại trong DB
    const admin = await userModel.findById(req.user._id);
    if (!admin) {
      return res.status(403).json({ success: false, message: "Admin không tồn tại." });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(500).json({ success: false, message: "Lỗi server khi xác thực admin!" });
  }
};

export default adminAuth;
