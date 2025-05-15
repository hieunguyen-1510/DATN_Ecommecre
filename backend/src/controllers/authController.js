import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import Role from "../models/roleModel.js";
import jwt from "jsonwebtoken";

// create token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role.name, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).populate("role");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    if (!user.role || !["user", "admin"].includes(user.role.name)) {
      return res.json({ success: false, message: "Only regular users or admins can log in here." });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role.name,
        name: user.name,
        email: user.email,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    await user.populate("role");
    const token = createToken(user);

    return res.json({ success: true, token, message: "Registration successful" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return res.status(500).json({ success: false, message: "Admin role not found." });
    }

    const admin = await userModel
      .findOne({ email, role: adminRole._id })
      .populate("role");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Thông tin đăng nhập không chính xác." });
    }

    const token = createToken(admin);
    return res.status(200).json({
      success: true,
      token,
      name: admin.name,
      message: "Đăng nhập admin thành công.",
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." });
  }
};

export { loginUser, registerUser, adminLogin };