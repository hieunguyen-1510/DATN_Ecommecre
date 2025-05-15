import React from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaCheckCircle, FaHeadset } from "react-icons/fa";

// Hiệu ứng stagger cho các mục chính sách
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaExchangeAlt />,
      title: "Chính sách đổi trả dễ dàng",
      desc: "Đổi trả không rắc rối, giúp bạn yên tâm mua sắm.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Chính sách hoàn trả trong 7 ngày",
      desc: "Hoàn trả trong vòng 7 ngày, không cần lý do.",
    },
    {
      icon: <FaHeadset />,
      title: "Dịch vụ hỗ trợ khách hàng tốt nhất",
      desc: "Chúng tôi luôn bên cạnh bạn 24/7.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <h2 className="text-center text-4xl font-bold mb-12 font-poppins text-black uppercase">
        Tại sao chọn chúng tôi
      </h2>
      <motion.div
        className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              className="text-4xl text-gray-800 mb-4"
              whileHover={{
                scale: 1.2,
                color: "#fb923c", 
                transition: { duration: 0.3 },
              }}
            >
              {policy.icon}
            </motion.div>
            <p className="text-xl font-semibold text-gray-800 font-poppins">
              {policy.title}
            </p>
            <p className="text-gray-600 font-poppins">{policy.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OurPolicy;