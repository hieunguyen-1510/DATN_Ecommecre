import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import axios from "axios";
import { toast } from "react-toastify";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Contact = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/contact`, formData);
      toast.success(response.data.message);
      // reset lai form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700">
      {/* Tiêu đề */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.contact_img})` }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center text-center">
          <div className="container max-w-7xl mx-auto px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg bebas-neue">Liên hệ với Street Style</h1>
            <p className="text-md md:text-lg text-gray-200 mt-2">Chúng tôi luôn sẵn sàng lắng nghe bạn!</p>
          </div>
        </div>
      </motion.div>

      {/* Nội dung */}
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-24">
        <div className="container max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Thông tin liên hệ */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold text-black mb-6 bebas-neue">Thông tin liên hệ</h2>
              <ul className="space-y-4 text-gray-600">
                <li>Email: streetstyle@gmail.com</li>
                <li>Điện thoại: +84 348 134 940</li>
                <li>Địa chỉ: 41, Đ.Số 1, KP.1 Hiệp Bình Chánh, Thủ Đức</li>
              </ul>
              <div className="flex gap-4 mt-6 text-red-500">
                <a href="https://www.facebook.com/"><FaFacebook size={24} /></a>
                <a href="https://github.com/hieunguyen-1510?tab=repositories"><FaGithub size={24} /></a>
                <a href="https://www.linkedin.com/in/hoaihieu1510/"><FaLinkedin size={24} /></a>
              </div>
            </div>

            {/* Form liên hệ */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
              <h2 className="text-4xl font-bold text-black mb-6 bebas-neue">Gửi tin nhắn cho chúng tôi</h2>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Họ và tên của bạn"
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email của bạn"
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Nội dung tin nhắn"
                rows="5"
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;