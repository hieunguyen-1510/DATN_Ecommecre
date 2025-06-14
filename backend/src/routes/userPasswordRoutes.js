import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendResetPasswordEmail } from "../helpers/resetPassword.js";
import User from "../models/userModel.js";

const passwordRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Quên mật khẩu - gửi link đặt lại
passwordRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email không được bỏ trống." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "Đã gửi link đặt lại mật khẩu tới mail của bạn!." });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Lưu token và thời hạn hết hạn vào user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; //1h
    await user.save();

    // Gửi email
    await sendResetPasswordEmail(email, resetLink);

    return res.status(200).json({ message: "Nếu email này tồn tại, bạn sẽ nhận được link đặt lại mật khẩu." });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return res.status(500).json({ message: "Không thể gửi email. Vui lòng thử lại." });
  }
});

// Đặt lại mật khẩu
passwordRouter.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token và mật khẩu không được bỏ trống." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Update mật khẩu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Xóa token reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
});

export default passwordRouter;
