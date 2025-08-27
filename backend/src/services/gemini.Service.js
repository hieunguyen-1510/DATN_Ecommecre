import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const getGeminiResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    // model: "gemini-pro",
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); 
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    throw new Error("Lỗi khi kết nối đến dịch vụ AI. Vui lòng thử lại sau.");
  }
};

export default getGeminiResponse;