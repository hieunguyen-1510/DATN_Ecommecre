import React from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

// Animation variants
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const LatestCollection = () => {
  const collections = [
    {
      name: "LIMITED EDITION",
      subtitle: "Xu hướng thời trang SS'23",
      image: assets.menFashion,
      path: "/men",
      theme: "dark",
      badge: "Mới",
      productCount: 12,
    },
    {
      name: "EXCLUSIVE LINEN",
      subtitle: "Bộ sưu tập mùa hè 2024",
      image: assets.womenFashion,
      path: "/women",
      theme: "light",
      badge: "Bán chạy",
      productCount: 24,
    },
    {
      name: "BAROQUE GLAM",
      subtitle: "Phong cách cổ điển hiện đại",
      image: assets.kidsFashion,
      path: "/kids",
      theme: "dark",
      badge: "Giảm 30%",
      productCount: 8,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-16 py-16 px-4 rounded-2xl relative overflow-hidden"
    >
      {/* Tiêu đề */}
      <div className="text-center pb-12">
        <Title text1="BỘ SƯU TẬP" text2="MỚI NHẤT" />
        <p className="w-full sm:w-3/4 md:w-1/2 m-auto text-sm sm:text-base text-gray-700 mt-4 font-light leading-relaxed text-center">
          Khám phá những thiết kế mới và nổi bật nhất được cập nhật liên tục từ
          shop, mang đậm dấu ấn Street Style.
        </p>
      </div>

      {/* Hiển thị bộ sưu tập */}
      <div className="container max-w-7xl mx-auto relative">
        <motion.div
          className="container max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Change grid to display 3 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                variants={itemVariants}
                className="relative z-10"
              >
                <Link
                  to={collection.path}
                  className="relative block group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Badge */}
                  {collection.badge && (
                    <div
                      className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${
                        collection.badge.includes("Giảm")
                          ? "bg-red-600 text-white"
                          : collection.theme === "dark"
                          ? "bg-white text-gray-900"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      {collection.badge}
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={collection.image}
                      alt={`Bộ sưu tập ${collection.name} - ${collection.subtitle}`}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105`}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      collection.theme === "dark"
                        ? "from-black/70 via-black/40 to-transparent"
                        : "from-white/70 via-white/40 to-transparent"
                    }`}
                  />

                  {/* Content */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 ${
                      collection.theme === "dark"? "text-white" : "text-gray-900"
                    }`}
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 group-hover:text-red-300 transition-colors duration-300">
                      {collection.name}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-80 mb-2">
                      {collection.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm">
                      {collection.productCount} sản phẩm
                    </p>
                    <div className="mt-2 sm:mt-3 h-px w-0 bg-current transition-all duration-500 group-hover:w-16" />
                  </div>

                  {/* Hover CTA */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className={`inline-block border-2 text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 font-medium rounded-full transition-all ${
                        collection.theme === "dark"
                          ? "border-white hover:bg-white/20 text-white"
                          : "border-gray-900 hover:bg-gray-900/10 text-gray-900"
                      }`}
                    >
                      KHÁM PHÁ NGAY
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Nút CTA */}
      <div className="text-center mt-16 px-4">
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="inline-block rounded-full overflow-hidden"
        >
          <a
            href="/collection"
            className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Xem tất cả
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LatestCollection;
