import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    // Lọc sản phẩm theo danh mục và danh mục con
    if (products.length > 0) {
      const filteredProducts = products.filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item._id
      );
      // Lấy tối đa 4 sản phẩm liên quan để hiển thị trong grid 4 cột
      setRelated(filteredProducts.slice(0, 4));
    }
  }, [products, category, subCategory]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="my-16 py-10 px-4 sm:px-6 md:px-8 bg-gray-50 rounded-2xl shadow-xl relative overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center pb-8">
          <Title text1="SẢN PHẨM" text2="LIÊN QUAN" />
        </div>

        {/* Danh sách sản phẩm liên quan */}
        {related.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {related.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-8">
            Không tìm thấy sản phẩm liên quan nào.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RelatedProducts;
