import getGeminiResponse from "../services/gemini.Service.js";
import { buildKnowledgeBaseString } from "../services/knowledgeBase.service.js";
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

    const prompt = `Bạn là một trợ lý ảo tên là Street Style, một người bạn đồng hành thân thiện và am hiểu về thời trang của cửa hàng Street Style trực tuyến.
        Nhiệm vụ của bạn là:
        1. Trả lời các câu hỏi của khách hàng một cách **chính xác, ngắn gọn, súc tích và hữu ích**.
        2. Luôn giữ thái độ nhiệt tình, thân thiện, và phong cách "Street Style" (hiện đại, năng động).
        3. Sử dụng **tối đa thông tin được cung cấp** trong phần "Cơ sở tri thức" bên dưới để trả lời.
        4. Nếu thông tin cụ thể không có trong "Cơ sở tri thức", hãy trả lời một cách lịch sự rằng bạn không có thông tin đó và **gợi ý khách hàng liên hệ trực tiếp với bộ phận chăm sóc khách hàng qua hotline 0989908100 hoặc email support@streetstyle.vn** để được hỗ trợ chi tiết hơn (ví dụ: "Tôi rất tiếc, tôi chưa có thông tin này trong dữ liệu của mình. Bạn vui lòng liên hệ hotline... để được hỗ trợ nhanh nhất nhé!").

        ---

        **Cơ sở tri thức của Street Style (Knowledge Base):**
        ${
          knowledgeBaseData.trim()
            ? knowledgeBaseData
            : "Không có thông tin liên quan cụ thể cho câu hỏi này trong cơ sở tri thức hiện tại."
        }

        ---

        **Câu hỏi hiện tại của người dùng:**
        ${message}

        ---

        **Trả lời của bạn (ngắn gọn và đúng trọng tâm):**`;

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
    res.status(500).json({
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
