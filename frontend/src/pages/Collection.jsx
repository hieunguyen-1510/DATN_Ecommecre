import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const categories = [
  {
    title: "Thời Trang Nam",
    subtitle: "Phong cách mạnh mẽ, hiện đại",
    image: assets.menFashion,
    path: "/collection/men",
    bgColor: "bg-gray-900",
    textColor: "text-white",
  },
  {
    title: "Thời Trang Nữ",
    subtitle: "Thanh lịch, quyến rũ, cá tính",
    image: assets.womenFashion,
    path: "/collection/women",
    bgColor: "bg-pink-200",
    textColor: "text-gray-900",
  },
  {
    title: "Thời Trang Trẻ Em",
    subtitle: "Dễ thương, năng động",
    image: assets.kidsFashion,
    path: "/collection/kids",
    bgColor: "bg-yellow-100",
    textColor: "text-gray-800",
  },
];

const Collection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4 px-6 text-sm">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Bộ sưu tập</span>
        </div>
      </nav>

      {/* Banner */}
      <section
        className="h-72 sm:h-[28rem] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${assets.banner_bst})`,
          filter: "brightness(1.1) contrast(1.05)",
        }}
      ></section>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="overflow-hidden rounded-xl shadow-lg cursor-pointer"
            onClick={() => navigate(cat.path)}
          >
            <div className="relative w-full aspect-[3/4]">
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110 hover:brightness-125"
              />
              <div
                className={`absolute inset-0 flex flex-col justify-end p-6 ${cat.textColor}`}
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
                }}
              >
                <h2 className="text-2xl font-bold mb-1">{cat.title}</h2>
                <p className="text-sm opacity-90 mb-2">{cat.subtitle}</p>
                {/* <span className="inline-block mt-2 px-4 py-2 bg-white text-sm font-medium text-gray-900 rounded-full hover:bg-gray-200 transition-all">
                  Khám phá ngay
                </span> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gợi ý điều hướng nhanh nếu muốn */}
      <div className="text-center mt-10">
        <p className="text-gray-600">Bạn muốn xem chi tiết hơn?</p>
        <Link
          to="/collection"
          className="inline-block mt-3 px-6 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default Collection;
