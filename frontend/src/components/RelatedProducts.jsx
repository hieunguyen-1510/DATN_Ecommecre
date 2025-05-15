import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductsItem from './ProductsItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    // Lọc sản phẩm theo danh mục và danh mục con
    if (products.length > 0) {
      const filteredProducts = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filteredProducts.slice(0, 5));
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
      className="py-24 bg-white"
    >
      <div className="container max-w-7xl mx-auto px-8">
        {/* Tiêu đề */}
        <div className="text-center text-3xl py-2 bebas-neue text-black">
          <Title text1="SẢN PHẨM" text2="LIÊN QUAN" />
        </div>
        {/* Danh sách sản phẩm liên quan */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
          {related.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition transform"
            >
              <ProductsItem id={item._id} name={item.name} image={item.image} price={item.price} />
              {item.isNew && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded shadow">
                  New
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RelatedProducts;
