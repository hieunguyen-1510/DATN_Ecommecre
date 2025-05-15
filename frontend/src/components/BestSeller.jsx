import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Title from "./Title";
import ProductsItem from "./ProductsItem";
import { ShopContext } from "../context/ShopContext";

// Hiệu ứng animation
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

  // Lọc sản phẩm bán chạy
  useEffect(() => {
    const filtered = products
      .filter((item) => item.bestseller === true)
      .slice(0, 6); // Hiển thị 6 sản phẩm
    setBestSeller(filtered);
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-12 bg-gray-50 py-12 px-4 rounded-xl shadow-md"
    >
      {/* Tiêu đề */}
      <div className="text-center pb-8">
        <Title text1="SẢN PHẨM" text2="BÁN CHẠY" />
        <p className="w-3/4 sm:w-1/2 m-auto text-sm md:text-base text-gray-600 mt-4 leading-relaxed">
          Chinh phục đường phố với những item hot nhất từ cộng đồng Street Style.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestseller.map((item, index) => (
            <motion.div
              key={item._id || index}
              variants={itemVariants}
              className="relative group rounded-xl bg-white border border-gray-200 shadow hover:shadow-lg overflow-hidden z-10"
              whileHover={{
                scale: 1.01,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Wrapper để giữ click hoạt động */}
              <div className="relative z-20">
                <ProductsItem
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                />
                {/* Badge HOT */}
                <motion.span
                  className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-3 py-1 text-xs rounded-full shadow pointer-events-none z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🔥 Hot
                </motion.span>
              </div>
              {/* Viền cam khi hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400 rounded-xl transition-colors duration-300 pointer-events-none z-0" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nút CTA */}
      <div className="text-center mt-10">
        <motion.div
          whileHover={{
            scale: 1.1,
            background: "linear-gradient(90deg, #fb923c, #ec4899)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <a
            href="/collection"
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full uppercase hover:shadow-lg transition-transform"
          >
            Xem thêm
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BestSeller;
