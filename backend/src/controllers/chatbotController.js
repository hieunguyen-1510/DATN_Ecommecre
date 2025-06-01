import getGeminiResponse  from "../services/gemini.Service.js";
import { buildKnowledgeBaseString } from "../services/knowledgeBase.Service.js";
import ChatMessage from "../models/chatMessageModel.js";
import { v4 as uuidv4 } from "uuid";

const handleChatMessage = async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user ? req.user.id : null;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Tin nhắn không được để trống." });
  }
  const currentSessionId = sessionId || uuidv4();
  try {
    await ChatMessage.create({
      userId,
      sessionId: currentSessionId,
      role: "user",
      message,
    });

    const knowledgeBaseData = await buildKnowledgeBaseString(message, userId);

    const prompt = `Bạn là một trợ lý ảo thân thiện và hữu ích cho một cửa hàng thời trang trực tuyến.
        Nhiệm vụ của bạn là trả lời các câu hỏi của khách hàng một cách chính xác, ngắn gọn và hữu ích.
        Sử dụng thông tin được cung cấp trong phần "Knowledge Base" dưới đây để trả lời.
        Nếu câu hỏi của người dùng nằm ngoài phạm vi kiến thức được cung cấp, hãy lịch sự gợi ý họ liên hệ với nhân viên hỗ trợ trực tiếp.

        **Knowledge Base:**
        ${knowledgeBaseData}

        **Câu hỏi của người dùng:**
        ${message}

        **Trả lời:**`;

    const botResponse = await getGeminiResponse(prompt);

    await ChatMessage.create({
      userId,
      sessionId: currentSessionId,
      role: "bot",
      message: botResponse,
    });
    res.json({
      success: true,
      response: botResponse,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error("Error in chatbot controller:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.",
      });
  }
};

const getChatHistory = async (req, res) => {
  const { sessionId } = req.query;
  const userId = req.user ? req.user.id : null;

  try {
    let query = { sessionId };

    if (userId) {
      query = { userId, sessionId };
    } else if (!sessionId) {
      return res.json({ success: true, message: [] });
    }

    const messages = await ChatMessage.find(query).sort({ timestamp: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res
      .status(500)
      .json({ success: false, message: "Không thể lấy lịch sử chat." });
  }
};

export { handleChatMessage, getChatHistory };
