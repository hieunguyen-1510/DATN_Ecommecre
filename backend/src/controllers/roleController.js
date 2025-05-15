import Role from "../models/roleModel.js";

// Lấy danh sách tất cả vai trò (roles)
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({}, "_id name");
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách vai trò:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: err.message,
    });
  }
};

export { getRoles };