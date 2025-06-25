import React, { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const About = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setSubmitMessage(
        "Cảm ơn bạn đã đăng ký! Ưu đãi sẽ được gửi đến email của bạn."
      );
      setMessageType("success");
      setEmail("");

      setTimeout(() => {
        setIsSubmitted(false);
        setSubmitMessage("");
        setMessageType("");
      }, 3000);
    } else {
      setSubmitMessage("Vui lòng nhập địa chỉ email của bạn.");
      setMessageType("error");
      setTimeout(() => {
        setSubmitMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ===== Breadcrumbs ===== */}
      <nav className="bg-gray-50 py-3 px-4">
        <div className="container max-w-7xl mx-auto text-sm">
          <Link to="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Giới thiệu</span>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative h-[36rem] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${assets.about_us})`,
        }}
      ></motion.section>

      {/* ===== Our Story Section ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-14 bg-gray-50"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                <span className="text-red-600">Câu Chuyện</span> Của Chúng Tôi
              </h2>
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                Năm 2020, từ một cửa hàng nhỏ tại Sài Gòn, Street Style ra đời
                với sứ mệnh mang văn hóa đường phố Việt Nam đến với thế giới.
                Chúng tôi tin rằng thời trang không chỉ là quần áo, mà là cách
                bạn kể câu chuyện của chính mình.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/about"
                  className="bg-gray-900 text-white py-2 px-6 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all"
                >
                  Xem thêm
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-gray-900 text-gray-900 py-2 px-6 rounded-full hover:bg-gray-100 hover:shadow-lg transition-all"
                >
                  Liên hệ
                </Link>
              </div>
            </div>
            <div>
              <img
                src={assets.our_story}
                alt="Câu chuyện của chúng tôi"
                className="w-full rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== Mission Section ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-14 bg-white"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="relative">
              <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl">
                <img
                  src={assets.mission_img}
                  alt="Bảng đen với hình ảnh bóng đèn và chữ 'Our Mission'"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                <span className="text-red-700">Sứ Mệnh</span> & Tầm Nhìn
              </h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-red-50 p-1 rounded-full mr-4 flex-shrink-0">
                    <span className="text-red-700 text-xl">🎯</span>
                  </div>
                  <div className="max-w-prose">
                    <h3 className="font-semibold text-lg mb-1">Sứ Mệnh</h3>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700">
                      Truyền cảm hứng để bạn tự tin thể hiện cá tính thông qua
                      phong cách streetwear đậm chất Việt.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-50 p-1 rounded-full mr-4 flex-shrink-0">
                    <span className="text-red-700 text-xl">👁️</span>
                  </div>
                  <div className="max-w-prose">
                    <h3 className="font-semibold text-lg mb-1">Tầm Nhìn</h3>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700">
                      Trở thành thương hiệu streetwear hàng đầu Đông Nam Á, góp
                      phần quảng bá văn hóa Việt ra thế giới.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== CTA Section ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 bg-white text-center"
      >
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Sẵn sàng <span className="text-red-600">thay đổi</span> phong cách?
          </h2>
          <p className="text-gray-600 mb-8">
            Đăng ký nhận ngay ưu đãi 10% cho đơn hàng đầu tiên
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="flex-grow px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white py-3 px-6 rounded-full hover:bg-red-700 hover:shadow-lg transition-all"
            >
              Đăng ký ngay
            </button>
          </form>
          {isSubmitted && (
            <p
              className={`mt-4 ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {submitMessage}
            </p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default About;
