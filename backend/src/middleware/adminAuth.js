import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ success: false, message: "Token không được cung cấp. Vui lòng đăng nhập." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    // Kiem tra quyen truy cap
    if (!decoded.role || (decoded.role !== "admin" && decoded.role !== "user")) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập API này." });
    }

    // neu la admin kiem tra xem co trong db
    if (decoded.role === "admin") {
      const admin = await userModel.findById(decoded.id);
      if (!admin) {
        return res.status(403).json({ success: false, message: "Admin không tồn tại." });
      }
    }

    req.user = decoded;
    next(); // chuyen tiep neu hop le
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại." });
  }
};

export default adminAuth;
