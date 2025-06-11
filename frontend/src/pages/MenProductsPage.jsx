import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MenProductsPage = () => {
  const { products, search } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relavent");
  const navigate = useNavigate();
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    let categoryFiltered = products.filter(
      (product) => product.category === "Men"
    );

    if (search) {
      categoryFiltered = categoryFiltered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    let sortedProducts = [...categoryFiltered];
    if (sortBy === "thấp-cao") {
      sortedProducts.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (sortBy === "cao-thấp") {
      sortedProducts.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    setDisplayProducts(sortedProducts);
    setLoading(false);
    setError(null);
  }, [products, search, sortBy]);

  const gridVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, duration: 0.8 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="bg-gray-50 py-3 px-4">
        <div className="container max-w-7xl mx-auto text-sm">
          <a href="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </a>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Bộ sưu tập Nam</span>
        </div>
      </nav>

      <section
        className="relative h-[28rem] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${assets.banner4})`,
        }}
      >
        <div className="container px-4 text-center z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 drop-shadow-md">
            BỘ SƯU TẬP NAM
          </h1>
          <p className="text-base sm:text-xl max-w-2xl mx-auto mb-4 drop-shadow-sm">
            Khám phá xu hướng thời trang nam mới nhất 2025. Phong cách hiện đại,
            cá tính và đa dạng lựa chọn cho bạn!
          </p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto flex flex-wrap justify-between items-center my-6 px-4 gap-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/men")}
            className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium shadow hover:bg-red-600 transition"
          >
            Nam
          </button>
          <button
            onClick={() => navigate("/women")}
            className="px-5 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
          >
            Nữ
          </button>
          <button
            onClick={() => navigate("/kids")}
            className="px-5 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
          >
            Trẻ em
          </button>
        </div>
        <div className="relative inline-block text-left w-full sm:w-auto">
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border-2 border-gray-200 bg-white text-sm px-4 py-2 pr-8 rounded-lg hover:bg-red-500 hover:text-white transition focus:outline-none appearance-none"
          >
            <option value="relavent">Sắp xếp theo: Phù hợp</option>
            <option value="thấp-cao">Sắp xếp theo: Giá thấp đến cao</option>
            <option value="cao-thấp">Sắp xếp theo: Giá cao đến thấp</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <p className="text-center py-10">Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">Lỗi: {error}</p>
        ) : displayProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {displayProducts.map((product) => (
              <motion.div key={product._id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center py-10">
            Không có sản phẩm nào trong bộ sưu tập này.
          </p>
        )}
      </div>
    </div>
  );
};

export default MenProductsPage;
