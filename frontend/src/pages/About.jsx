import React, { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const About = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Variants for individual items to stagger animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      //   console.log("Submitting email:", email);
      setIsSubmitted(true);
      setSubmitMessage(
        "Cảm ơn bạn đã đăng ký! Ưu đãi sẽ được gửi đến email của bạn."
      );
      setMessageType("success");
      setEmail("");

      // Reset form 3s
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
          <span className="text-red-600 font-medium">Giới thiệu</span>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative h-[28rem] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${assets.about_us})`,
        }}
      ></motion.section>
      {/* ===== Our Story ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-14 bg-gray-50"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                <span className="text-red-600">Câu Chuyện</span> Của Chúng Tôi
              </h2>

              <p className="text-base text-gray-700 mb-4 leading-relaxed">
                Năm 2020, từ một cửa hàng nhỏ tại Sài Gòn, Street Style ra đời
                với sứ mệnh mang
                <strong> văn hóa đường phố Việt Nam</strong> đến với thế giới.
                Chúng tôi tin rằng thời trang không chỉ là quần áo, mà là cách
                bạn kể câu chuyện của chính mình.
              </p>

              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                Đến nay, chúng tôi tự hào đã đồng hành cùng hơn{" "}
                <strong>5,000 khách hàng</strong>, mang đến những trải nghiệm
                mua sắm khác biệt với chất lượng từng đường kim mũi chỉ.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg" // Added duration and shadow
                >
                  Xem thêm
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg" // Added duration and shadow
                >
                  Liên hệ
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="order-1 lg:order-2 relative"
            >
              <img
                src={
                  assets.our_story ||
                  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
                }
                alt="Hình ảnh cửa hàng Street Style với các mẫu quần áo treo trên giá"
                className="w-full h-auto rounded-xl shadow-xl"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== Mission ===== */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-14 bg-white"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                    <p className="text-gray-700">
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
                    <p className="text-gray-700">
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
        className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-center"
      >
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Sẵn sàng <span className="text-red-500">thay đổi</span> phong cách?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {" "}
            {/* Increased font size slightly */}
            Đăng ký nhận ngay ưu đãi 10% cho đơn hàng đầu tiên
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900" // Đổi red-500 thành red-400 hoặc màu khác
              required
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg" // Thêm hover:shadow-lg
            >
              Đăng ký ngay
            </button>
          </form>

          {isSubmitted && submitMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mt-4 text-sm flex items-center justify-center ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <span className="mr-2 text-lg">✅</span>
              ) : (
                <span className="mr-2 text-lg">❌</span>
              )}
              {submitMessage}
            </motion.p>
          )}

          {!isSubmitted && (
            <p className="text-gray-400 text-sm mt-4">
              Chúng tôi cam kết không spam email của bạn
            </p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default About;
