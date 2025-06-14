import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Collection = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      name: "MINI STYLE",
      subtitle: "Phong cách cổ điển hiện đại",
      image: assets.kidsFashion,
      path: "/kids",
      theme: "dark",
      badge: "Giảm 30%",
      productCount: 8,
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="mt-0 min-h-screen bg-white text-gray-900">
      {/* ===== Breadcrumbs ===== */}
      <nav className="bg-gray-50 py-3 px-4">
        <div className="container max-w-7xl mx-auto text-sm">
          <Link to="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Bộ sưu tập</span>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative h-72 sm:h-[28rem] bg-cover bg-center flex items-center justify-center text-white p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${assets.bst_banner})`,
        }}
      ></motion.section>

      {/* ===== Main Content Container ===== */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-8 lg:px-14">
        {/* ===== Filter Bar ===== */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center my-6 gap-3 text-sm">
          <button className="px-5 py-2 bg-gray-900 text-white rounded-full">
            Tất cả
          </button>
          <button
            onClick={() => navigate("/men")}
            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            Nam
          </button>
          <button
            onClick={() => navigate("/women")}
            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            Nữ
          </button>
          <button
            onClick={() => navigate("/kids")}
            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            Trẻ em
          </button>
        </div>

        {/* ===== Collection Grid ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {loading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={collection.image}
                    alt={`Bộ sưu tập ${collection.name} - ${collection.subtitle}`}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                      loading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => setLoading(false)}
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
                  className={`absolute bottom-0 left-0 right-0 p-6 ${
                    collection.theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-red-300 transition-colors duration-300">
                    {collection.name}
                  </h3>
                  <p className="text-sm opacity-80 mb-2">
                    {collection.subtitle}
                  </p>
                  <p className="text-sm">{collection.productCount} sản phẩm</p>
                  <div className="mt-3 h-px w-0 bg-current transition-all duration-500 group-hover:w-16" />
                </div>
                {/* Hover CTA */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <span
                    className={`inline-block border-2 ${
                      collection.theme === "dark"
                        ? "border-white hover:bg-white/20 text-white"
                        : "border-gray-900 hover:bg-gray-900/10 text-gray-900"
                    } px-6 py-2 text-sm font-medium rounded-full transition-all`}
                  >
                    KHÁM PHÁ NGAY
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== Load More ===== */}
      <div className="mt-12 text-center pb-12">
        <button
          onClick={() => navigate("/")}
          className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Xem thêm bộ sưu tập
        </button>
      </div>
    </div>
  );
};

export default Collection;
