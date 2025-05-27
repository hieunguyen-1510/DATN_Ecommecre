import Role from "../models/roleModel.js";
import mongoose from "mongoose"; 

const initializeRolesAndAssignDefault = async function (next) {
  try {
    // Chỉ xử lý khi là user mới và chưa có role
    if (this.isNew && !this.role) {
      // Đảm bảo roles mặc định tồn tại
      const defaultRoles = ["user", "admin"];
      for (const roleName of defaultRoles) {
        let existingRole = await Role.findOne({ name: roleName });
        if (!existingRole) {
          // Nếu không có role, tạo mới
          await Role.create({ name: roleName });
        }
      }

      // Gán vai trò mặc định là "user"
      const userRole = await Role.findOne({ name: "user" });
      if (!userRole) {
        throw new Error("Không tìm thấy vai trò 'user'");
      }

      // Đảm bảo trường role là ObjectId thay vì chuỗi
      this.role = mongoose.Types.ObjectId(userRole._id); 
    }

    next(); 
  } catch (error) {
    next(error); 
  }
};

export { initializeRolesAndAssignDefault };
