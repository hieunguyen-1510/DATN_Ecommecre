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

//gui mail lien he
const sendContactEmail = async (name, email, message) => {
  const mailOptions = {
    from: `"${name}" <${email}>`, 
    to: process.env.USER_MAIL, 
    subject: `Tin nhắn từ ${name} - Street Style`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Tin nhắn từ Street Style</h2>
        <p><strong>Họ và tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nội dung:</strong> ${message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent to ${process.env.USER_MAIL} from ${email}`);
  } catch (error) {
    console.error(`Error sending contact email from ${email}:`, error);
    throw new Error("Failed to send contact email");
  }
};

export { transporter, sendContactEmail };