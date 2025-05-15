import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import Title from "./Title";

const Category = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = [
    {
      id: 1,
      title: "Thời Trang Nam",
      description: "Phong cách nam tính đầy mạnh mẽ",
      image: assets.menFashion,
      path: "/collection",
      featured: true
    },
    {
      id: 2,
      title: "Thời Trang Nữ",
      description: "Nét đẹp quyến rũ và thanh lịch",
      image: assets.womenFashion,
      path: "/collection",
      badge: "New"
    },
    {
      id: 3,
      title: "Thời Trang Trẻ Em",
      description: "Dễ thương và năng động cho bé",
      image: assets.kidsFashion,
      path: "/collection",
      badge: "Hot"
    }
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
      <Title text1="DANH MỤC" text2="SẢN PHẨM" />
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Khám phá các bộ sưu tập đa dạng dành cho mọi lứa tuổi
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              onClick={() => handleClick(category.path)}
              className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg h-72"
              whileHover={{ scale: 1.03 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              transition={{ duration: 0.3 }}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay cơ bản */}
              <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" />
              
              {/* Overlay khi hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col items-center justify-center text-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 0.8 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3
                  className="text-white font-bold text-2xl mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: hoveredIndex === index ? 0 : 20, opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {category.title}
                </motion.h3>
                <motion.p
                  className="text-white text-sm mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: hoveredIndex === index ? 0 : 20, opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {category.description}
                </motion.p>
                <motion.button
                  className="bg-white text-purple-500 px-6 py-2 rounded-full font-medium text-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: hoveredIndex === index ? 0 : 20, opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Xem ngay
                </motion.button>
              </motion.div>
              
              {/* Title cố định */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-white font-semibold text-xl">{category.title}</h3>
              </div>
              
              {/* Badges */}
              {category.badge && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {category.badge}
                </div>
              )}
              
              {category.featured && (
                <div className="absolute top-4 left-4 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;