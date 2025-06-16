import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ===== Breadcrumbs ===== */}
      <nav className="bg-gray-50 py-3 px-4 text-xs sm:text-sm">
        <div className="container max-w-7xl mx-auto text-sm">
          <Link to="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Liên hệ</span>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[24rem] sm:h-[28rem] md:h-[32rem] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${assets.contact_img})`, 
          backgroundPosition: "center 30%",
        }}
      >
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-md"
          >
            Kết Nối Với Street Style
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-100 max-w-2xl mx-auto"
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </motion.p>
        </div>
      </motion.div>

      {/* ===== Main Content ===== */}
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12"
        >
          {/* ===== Contact Info ===== */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              Thông Tin Liên Hệ
            </h2>

            <div className="space-y-6">
              {/* Địa chỉ với Google Maps */}
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-red-600 mt-1 mr-4 text-xl" />{" "}
                {/* Consistent red-600 */}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Địa Chỉ Cửa Hàng
                  </h3>
                  <p className="text-gray-600 mt-1">
                    2 Đ. Trường Sa, Phường 17, Bình Thạnh, Hồ Chí Minh 70000,
                    Việt Nam
                  </p>
                  <div className="mt-4 w-full aspect-[4/3] sm:aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2426872763162!2d106.7014633796137!3d10.79271556191487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175299a2a7aeb89%3A0xfe75f3431d8fd812!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBUaOG7p3kgbOG7o2kgLSBQaMOibiBoaeG7h3UgTWnhu4FuIE5hbQ!5e0!3m2!1svi!2sus!4v1748010359490!5m2!1svi!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Bản đồ địa chỉ cửa hàng Street Style"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Giờ làm việc */}
              <div className="flex items-start">
                <FaClock className="text-red-600 mt-1 mr-4 text-xl" />
                <div>
                  <h3 className="font-semibold text-gray-800">Giờ Làm Việc</h3>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Thứ 2 - Thứ 6:</span> 8:00 -
                    21:00
                    <br />
                    <span className="font-medium">Thứ 7 - CN:</span> 9:00 -
                    22:00
                  </p>
                </div>
              </div>

              {/* Điện thoại */}
              <div className="flex items-start">
                <FaPhone className="text-red-600 mt-1 mr-4 text-xl" />{" "}
                {/* Consistent red-600 */}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Hỗ Trợ Khách Hàng
                  </h3>
                  <p className="text-gray-600 mt-1">+84 348 134 940</p>
                  <p className="text-sm text-gray-500 mt-1">
                    (Hỗ trợ 24/7 cho đơn hàng trực tuyến)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <FaEnvelope className="text-red-600 mt-1 mr-4 text-xl" />{" "}
                {/* Consistent red-600 */}
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600 mt-1">support@streetstyle.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Phản hồi trong vòng 24 giờ
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-4">Mạng Xã Hội</h3>
              <div className="flex gap-4">
                {[
                  {
                    icon: <FaFacebook />,
                    url: "https://facebook.com/streetstyleofficial",
                    color: "bg-blue-600",
                  }, // Example URL
                  {
                    icon: <FaGithub />,
                    url: "https://github.com/your-org/streetstyle",
                    color: "bg-gray-800",
                  }, // Example URL
                  {
                    icon: <FaLinkedin />,
                    url: "https://linkedin.com/company/streetstyle",
                    color: "bg-blue-700",
                  }, // Example URL
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className={`${social.color} text-white p-2 sm:p-3 rounded-full text-base sm:text-lg`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ===== Contact Form ===== */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm md:text-base">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" // Consistent red-500
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" // Consistent red-500
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nội Dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Xin chào Street Style, tôi muốn hỏi về..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" // Consistent red-500
                  required
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang gửi...
                    </span>
                  ) : (
                    "Gửi Tin Nhắn"
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Chúng tôi cam kết bảo mật thông tin của bạn. Xem{" "}
                <a href="/privacy" className="text-red-600 hover:underline">
                  Chính sách bảo mật
                </a>
                . {/* Consistent red-600 */}
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== FAQ Section ===== */}
      <div className="bg-gray-100 py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Câu Hỏi Thường Gặp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                question: "Tôi có thể đổi trả sản phẩm trong bao lâu?",
                answer: "Chấp nhận đổi trả trong 30 ngày với hóa đơn.",
              },
              {
                question: "Có hỗ trợ giao hàng quốc tế không?",
                answer:
                  "Hiện tại chúng tôi chỉ giao hàng trong lãnh thổ Việt Nam.",
              },
              {
                question: "Thanh toán những phương thức nào?",
                answer: "Chấp nhận COD, chuyển khoản, VNPay, Visa/Mastercard.",
              },
              {
                question: "Thời gian giao hàng dự kiến?",
                answer: "3-5 ngày với nội thành, 5-7 ngày với tỉnh thành khác.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
