import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const womenSubCategories = [
  {
    title: "Long Sleeve Tees",
    subtitle: "Layer Up In Style",
    image: assets.womenLongSleeve,
    path: "/collection/women/longsleeve",
  },
  {
    title: "Cozy Hoodies",
    subtitle: "Stay Warm & Chic",
    image: assets.womenHoodie,
    path: "/collection/women/hoodie",
  },
  {
    title: "Sweater Season",
    subtitle: "Soft & Stylish",
    image: assets.womenSweater,
    path: "/collection/women/sweaters",
  },
  {
    title: "Elegant Outerwear",
    subtitle: "Finish Every Look",
    image: assets.womenJackets,
    path: "/collection/women/jackets",
  },
  {
    title: "Smart Pants",
    subtitle: "Comfortable & Classy",
    image: assets.womenKaki,
    path: "/collection/women/kaki",
  },
];

const WomenCollection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4 px-4 sm:px-6 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/collection" className="text-gray-600 hover:text-red-600">
            Bộ sưu tập
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Nữ</span>
        </div>
      </nav>

      {/* Banner */}
      <section className="relative mx-auto max-w-7xl mt-6 rounded-xl overflow-hidden">
        <img
          src={assets.womenBanner}
          alt="Women Banner"
          className="w-full h-[28rem] sm:h-[32rem] md:h-[36rem] object-cover object-top"
        />
      </section>

      {/* Danh mục phụ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-3xl font-bold text-center mb-12">New Collection</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {womenSubCategories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl shadow-lg cursor-pointer group relative"
              onClick={() => navigate(cat.path)}
            >
              <div className="relative w-full aspect-[3/4]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 transition-all">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-white opacity-90 text-sm">
                    {cat.subtitle}
                  </p>
                  <span className="mt-3 inline-block px-4 py-1 bg-white text-black text-sm font-semibold rounded-full group-hover:bg-black group-hover:text-white transition">
                    Khám phá
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quay lại bộ sưu tập chính */}
      <div className="text-center mt-10 mb-20">
        <p className="text-gray-600">Bạn muốn xem toàn bộ bộ sưu tập?</p>
        <Link
          to="/collection"
          className="inline-block mt-3 px-6 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition"
        >
          Trở về Bộ sưu tập
        </Link>
      </div>
    </div>
  );
};

export default WomenCollection;
