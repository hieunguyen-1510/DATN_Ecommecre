import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("chatbotSessionId") || null
  );
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const CHATBOT_API_BASE_URL = `${backendUrl}/api/chatbot`;

  // scroll để quyết định hiển thị nút
  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Hiện nút nếu cuộn gần cuối trang
      if (scrolled + windowHeight >= fullHeight - 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (sessionId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${CHATBOT_API_BASE_URL}/history?sessionId=${sessionId}`,
            {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            }
          );
          if (response.data.success) {
            setMessages(
              response.data.messages.map((msg) => ({
                role: msg.role,
                text: msg.message,
              }))
            );
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
          localStorage.removeItem("chatbotSessionId");
          setSessionId(null);
        }
      }
    };
    if (isOpen) {
      loadChatHistory();
    } else {
      setMessages([]);
    }
  }, [sessionId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const userMessage = inputMessage.trim();
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInputMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${CHATBOT_API_BASE_URL}/message`,
        { message: userMessage, sessionId },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      if (response.data.success) {
        const botResponse = response.data.response;
        const newSessionId = response.data.sessionId;
        if (newSessionId && !sessionId) {
          setSessionId(newSessionId);
          localStorage.setItem("chatbotSessionId", newSessionId);
        }
        setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Có lỗi xảy ra. Vui lòng thử lại sau." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      {!isOpen && visible && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Mở chatbot"
        >
          <AiOutlineMessage className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 animate-fadeIn">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold">Chatbot hỗ trợ</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Đóng chatbot"
            >
              <AiOutlineClose className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm custom-scrollbar">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center italic">
                Xin chào! Tôi có thể giúp gì cho bạn?
              </p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200 flex"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
