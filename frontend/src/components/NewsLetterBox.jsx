import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaPaperPlane } from "react-icons/fa";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Xử lý logic đăng ký thực tế ở đây
      setIsSubmitted(true);
      setEmail("");
      // Reset form sau 3 giây
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-orange-50 to-orange-100 py-16 px-4 rounded-lg shadow-lg"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-block text-orange-500 mb-4"
          >
            <FaBell className="text-4xl mx-auto" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 uppercase mb-3">
            CẬP NHẬT PHONG CÁCH ĐƯỜNG PHỐ
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Nhận những cập nhật mới nhất về{" "}
            <span className="font-semibold">Phong cách đường phố</span> — Bộ sưu
            tập mới, xu hướng thời trang đô thị, và các sự kiện đặc biệt!
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn để cập nhật"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-700 bg-white"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <span className="mr-2">Đăng ký ngay</span>
              <FaPaperPlane />
            </motion.button>
          </div>

          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-green-600 font-medium"
            >
              Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những cập nhật mới nhất đến email của bạn.
            </motion.div>
          )}
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Chúng tôi tôn trọng quyền riêng tư của bạn và không bao giờ chia sẻ thông tin cá nhân.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default NewsletterForm;