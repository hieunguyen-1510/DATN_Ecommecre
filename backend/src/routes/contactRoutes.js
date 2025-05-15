import express from "express";
import { sendContactEmail } from "../helpers/mailer.js"; 

const contactRouter = express.Router();

contactRouter.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    await sendContactEmail(name, email, message);
    res.status(200).json({ message: "Tin nhắn đã được gửi thành công!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ message: "Không thể gửi tin nhắn. Vui lòng thử lại." });
  }
});

export default contactRouter;