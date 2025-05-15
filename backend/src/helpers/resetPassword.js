import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

const sendResetPasswordEmail = async (toEmail, resetLink) => {
    const mailOptions = {
      from: `"Street Style Hỗ Trợ" <${process.env.USER_MAIL}>`,
      to: toEmail,
      subject: "Đặt Lại Mật Khẩu - Street Style",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <h2 style="color: #2c3e50;">Đặt Lại Mật Khẩu</h2>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
          <a 
            href="${resetLink}" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="display: inline-block; color: #fff; background-color: #ff5722; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >
            Đặt Lại Mật Khẩu
          </a>
          <p>Link này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to ${toEmail}`);
    } catch (error) {
      console.error(`Error sending reset password email to ${toEmail}:`, error);
      throw new Error("Failed to send reset password email");
    }
  };

export { transporter, sendResetPasswordEmail };