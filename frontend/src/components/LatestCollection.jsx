import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import ProductCard from "./ProductCard";
import { ShopContext } from "../context/ShopContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Animation
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
  const { products } = useContext(ShopContext);
  const [latest, setLatest] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Sắp xếp sản phẩm theo thời gian tạo mới nhất
    const filtered = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatest(filtered);
  }, [products]);

  // Hiển thị 4 sản phẩm mỗi lần
  const visibleProducts = latest.slice(currentIndex, currentIndex + 4);

  // Chức năng chuyển slide tiếp theo
  const nextSlide = () => {
    if (currentIndex + 4 < latest.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Chức năng chuyển slide trước đó
  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-16 py-16 px-4 bg-gray-50 rounded-2xl shadow-xl relative overflow-hidden"
    >
      {/* Tiêu đề */}
      <div className="text-center pb-12">
        <Title text1="BỘ SƯU TẬP" text2="MỚI NHẤT" />
        <p className="w-3/4 sm:w-1/2 m-auto text-base md:text-base text-gray-700 mt-4 font-light leading-relaxed">
          Khám phá những thiết kế mới và nổi bật nhất được cập nhật liên tục từ
          shop, mang đậm dấu ấn Street Style.
        </p>
      </div>

      {/* Hiển thị sản phẩm với nút điều hướng */}
      <div className="container max-w-7xl mx-auto relative">
        {/* Nút điều hướng trái */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 ${
            currentIndex === 0
              ? "opacity-40 cursor-not-allowed"
              : "text-yellow-500"
          }`}
          aria-label="Previous products"
        >
          <FiChevronLeft className="text-3xl" />
        </button>
        {/* Nút điều hướng phải */}
        <button
          onClick={nextSlide}
          disabled={currentIndex + 4 >= latest.length}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 ${
            currentIndex + 4 >= latest.length
              ? "opacity-40 cursor-not-allowed"
              : "text-yellow-500"
          }`}
          aria-label="Next products"
        >
          <FiChevronRight className="text-3xl" />
        </button>

        <motion.div
          className="container max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
            {visibleProducts.map((item, index) => (
              <motion.div
                key={item._id || index}
                variants={itemVariants}
                className="relative z-10"
              >
                <ProductCard product={item} />

                {/* Badge Mới - Đồng bộ style với tag Hot của BestSeller */}
                <motion.span
                  className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold px-4 py-1.5 text-xs rounded-full shadow-md pointer-events-none z-30 uppercase tracking-wider flex items-center gap-1" // Tăng z-index lên z-30
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                >
                  🆕 Mới
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Nút CTA - Đồng bộ style với BestSeller */}
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
            className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Xem tất cả
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LatestCollection;
