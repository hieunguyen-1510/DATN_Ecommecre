
const authAccess = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ success: false, message: "Chưa xác thực người dùng." });
  }

  if (req.user.role === "user" || req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập." });
};

export default authAccess;
