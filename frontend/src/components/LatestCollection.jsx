import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import ProductsItem from "./ProductsItem";
import { ShopContext } from "../context/ShopContext";

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

  useEffect(() => {
    // console.log("Tất cả sản phẩm từ context:", products);

    const filtered = [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo ngày
      .slice(0, 8);

    // console.log("Sản phẩm mới nhất:", filtered);
    setLatest(filtered);
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-12 bg-gray-50 py-12 px-4"
    >
      {/* Tiêu đề */}
      <div className="text-center pb-8">
        <Title text1="BỘ SƯU TẬP" text2="MỚI NHẤT" />
        <p className="w-3/4 sm:w-1/2 m-auto text-sm md:text-base text-gray-600 mt-4 leading-relaxed">
          Khám phá những thiết kế mới và nổi bật nhất được cập nhật liên tục từ shop.
        </p>
      </div>

      {/* Hiển thị sản phẩm */}
      <motion.div
        className="container max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {latest.map((item, index) => (
            <motion.div
              key={item._id || index}
              variants={itemVariants}
              className="relative group rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden z-10"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-20">
                <ProductsItem
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                />

                {/* Badge Mới */}
                <motion.span
                  className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 text-xs rounded-full shadow pointer-events-none z-10 flex items-center gap-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🆕 Mới
                </motion.span>
              </div>

              {/* Viền hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500 rounded-2xl transition-colors duration-300 pointer-events-none z-0" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nút CTA */}
      <div className="text-center mt-8">
        <motion.div
          whileHover={{
            scale: 1.1,
            background: "linear-gradient(90deg, #34d399, #60a5fa)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <a
            href="/collection"
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-full uppercase hover:shadow-lg transition-transform"
          >
            Xem tất cả
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LatestCollection;
