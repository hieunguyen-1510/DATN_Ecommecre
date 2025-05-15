import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userModel from "./src/models/userModel.js";
import Role from "./src/models/roleModel.js"; 

dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    // Tạo role admin nếu chưa tồn tại
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = await Role.create({ name: "admin" });
      console.log("✅ Created admin role");
    }

    // Tạo tài khoản admin
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    const adminExists = await userModel.findOne({ 
      email: process.env.ADMIN_EMAIL,
      role: adminRole._id 
    });

    if (!adminExists) {
      await userModel.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: adminRole._id 
      });
      console.log("✅ Admin account created successfully!");
    } else {
      console.log("ℹ️ Admin account already exists");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Chạy script
connectDB().then(seedAdmin);