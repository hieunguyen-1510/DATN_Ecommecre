import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Title from "./Title"; 
import ProductCard from "./ProductCard"; 
import { ShopContext } from "../context/ShopContext"; 
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; 

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

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestseller, setBestSeller] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Lọc sản phẩm bán chạy
  useEffect(() => {
    const filtered = products.filter((item) => item.bestseller === false);
    setBestSeller(filtered);
  }, [products]);

  // Hiển thị 4 sản phẩm mỗi lần
  const visibleProducts = bestseller.slice(currentIndex, currentIndex + 4);

  const nextSlide = () => {
    if (currentIndex + 4 < bestseller.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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
      
      className="my-16 py-16 px-4 bg-gray-50 rounded-2xl relative overflow-hidden" 
    >
      {/* Tiêu đề */}
      <div className="text-center pb-12"> 
        <Title text1="SẢN PHẨM" text2="BÁN CHẠY" /> 
        <p className="w-3/4 sm:w-1/2 m-auto text-base md:text-base text-gray-700 mt-4 font-light leading-relaxed"> 
          Khám phá những mặt hàng độc đáo, thể hiện cá tính riêng, và luôn dẫn đầu xu hướng từ cộng đồng Street Style.
        </p>
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between items-center absolute top-1/2 left-0 right-0 z-20 px-6 transform -translate-y-1/2"> 
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 ${
            currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "text-yellow-500" 
          }`}
        >
          <FiChevronLeft className="text-3xl" /> 
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex + 4 >= bestseller.length}
          className={`p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 ${
            currentIndex + 4 >= bestseller.length
              ? "opacity-40 cursor-not-allowed"
              : "text-yellow-500" 
          }`}
        >
          <FiChevronRight className="text-3xl" /> 
        </button>
      </div>

      {/* Hiển thị sản phẩm */}
      <motion.div
        className="container max-w-6xl mx-auto overflow-hidden px-4" 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        ref={carouselRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {visibleProducts.map((item, index) => (
            <motion.div
              key={item._id || index}
              variants={itemVariants}
              
              className="relative z-10" 
            >
              <ProductCard product={item} /> 
              
              {/* Badge Hot - Đảm bảo hiển thị trên cùng */}
              <motion.span
                className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold px-4 py-1.5 text-xs rounded-full shadow-md pointer-events-none z-30 uppercase tracking-wider" // Tăng z-index lên z-30
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} 
              >
                🔥 Hot
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
            className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
          >
            Xem thêm
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BestSeller;
