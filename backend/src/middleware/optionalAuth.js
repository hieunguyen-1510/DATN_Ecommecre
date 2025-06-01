import jwt from "jsonwebtoken";
// import User from "../models/userModel.js"; // Nếu muốn lấy đầy đủ thông tin user vào req.user

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    //
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Gan thong tin user tu token vao req.user
        req.user = {
          _id: decoded.userId || decoded.id,
          id: decoded.userId || decoded.id,
          role: decoded.role, // role : user or admin
          name: decoded.name,
        };
      } catch (error) {
        console.warn("Token không hợp lệ hoặc hết hạn:", error.message);
      }
      next();
    }
  } catch (error) {
    console.error("Lỗi trong middleware optionalAuth:", error);
    // Xử lý lỗi server
    next(error);
  }
};

export default optionalAuth;
