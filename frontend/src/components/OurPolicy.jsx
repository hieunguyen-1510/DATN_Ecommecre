import React from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaCheckCircle, FaHeadset } from "react-icons/fa";
import Title from "./Title";

// Hiệu ứng stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaExchangeAlt />,
      title: "Chính sách đổi trả",
      desc: "Đổi trả không rắc rối, giúp bạn yên tâm mua sắm với quy trình đơn giản và nhanh chóng.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Chính sách hoàn trả",
      desc: "Hoàn trả trong vòng 7 ngày, không cần lý do. Chúng tôi cam kết hoàn tiền đầy đủ và minh bạch.",
    },
    {
      icon: <FaHeadset />,
      title: "Hỗ trợ khách hàng",
      desc: "Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giải đáp mọi thắc mắc và hỗ trợ bạn.",
    },
  ];

  return (
    <div className="py-16">
      <div className="text-center pb-12">
        <Title text1="TẠI SAO" text2="CHỌN CHÚNG TÔI" />
      </div>

      <motion.div
        className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col items-center text-center bg-white p-8 rounded-2xl
                       transform hover:-translate-y-2 transition-all duration-300 ease-in-out"
          >
            <motion.div
              className="text-4xl mb-6 text-blue-500"
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
            >
              {policy.icon}
            </motion.div>
            <p className="text-lg font-bold text-gray-900 mb-3">
              {policy.title}
            </p>
            <p className="text-gray-700 leading-relaxed text-sm">
              {policy.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OurPolicy;
