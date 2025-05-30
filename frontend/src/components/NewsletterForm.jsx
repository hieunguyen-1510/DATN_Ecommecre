import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaPaperPlane } from "react-icons/fa";
import Title from "./Title"; 

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Xử lý logic đăng ký thực tế ở đây
      console.log("Email đăng ký:", email); 
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
      
      className="my-16 py-16 px-4 bg-gray-50 rounded-2xl relative overflow-hidden" 
    >
      <div className="max-w-4xl mx-auto"> 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10" 
        >
          {/* Icon chuông - Đồng bộ màu và tăng kích thước */}
          <motion.div
            whileHover={{ scale: 1.15 }} 
            className="inline-block text-yellow-500 mb-6" 
          >
            <FaBell className="text-6xl mx-auto" /> 
          </motion.div>
          
          <Title text1="CẬP NHẬT" text2="PHONG CÁCH ĐƯỜNG PHỐ" />
          
          <p className="text-gray-700 text-base max-w-2xl mx-auto leading-relaxed mt-4"> 
            Nhận những cập nhật mới nhất về{" "}
            <span className="font-bold text-orange-500">Phong cách đường phố</span> — Bộ sưu
            tập mới, xu hướng thời trang đô thị, và các sự kiện đặc biệt!
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email để nhận tin..." 
                className="w-full px-4 py-4 rounded-full border-2 border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all text-gray-800 text-sm shadow-sm" /* Tăng padding, border-width, font-size, shadow */
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              // Đồng bộ style nút với các nút CTA khác
              className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center" 
            >
              <span className="mr-3">Đăng ký ngay</span> 
              <FaPaperPlane className="text-sm" /> 
            </motion.button>
          </div>

          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center text-green-600 font-semibold text-base" // Tăng margin top, font-weight
            >
              Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những cập nhật mới nhất đến email của bạn.
            </motion.div>
          )}
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-gray-600 text-sm mt-8" // Tăng margin top
        >
          Chúng tôi tôn trọng quyền riêng tư của bạn và không bao giờ chia sẻ thông tin cá nhân.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default NewsletterForm;
