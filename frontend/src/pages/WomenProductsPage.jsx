import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const WomenProductsPage = () => {
  const { search, token } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relavent");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (!token) {
          setError("Bạn chưa đăng nhập hoặc phiên đăng nhập không hợp lệ.");
          setLoading(false);
          return;
        }

        let apiUrl = `${backendUrl}/api/product/list?category=Women`;

        if (search) {
          apiUrl += `&search=${search}`;
        }

        if (sortBy === "thấp-cao") {
          apiUrl += `&sortBy=priceAsc`;
        } else if (sortBy === "cao-thấp") {
          apiUrl += `&sortBy=priceDesc`;
        }

        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(
            response.data.message || "Không thể tải danh sách sản phẩm."
          );
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError(
            "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
          );
        } else {
          setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy, search, token]);

  // Animation variants
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
      {/* Breadcrumbs */}
      <nav className="bg-gray-50 py-3 px-4">
        <div className="container max-w-7xl mx-auto text-sm">
          <a href="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </a>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Bộ sưu tập Nữ</span>
        </div>
      </nav>

      {/* Hero Banner */}
      <section
        className="relative h-64 sm:h-80 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${
            assets.bst_banner ||
            "https://images.unsplash.com/photo-1582719500649-064106517a10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          })`,
        }}
      >
        <div className="container px-4 text-center z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 drop-shadow-md">
            BỘ SƯU TẬP NỮ
          </h1>
          <p className="text-base sm:text-xl max-w-2xl mx-auto mb-4 drop-shadow-sm">
            Khám phá xu hướng thời trang nữ mới nhất 2025. Nét đẹp thanh lịch,
            nữ tính và đầy cá tính đang chờ bạn!
          </p>
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <div className="container max-w-7xl mx-auto flex flex-wrap justify-between items-center my-6 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/men")}
            className="px-5 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
          >
            Nam
          </button>
          <button
            onClick={() => navigate("/women")}
            className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium shadow hover:bg-red-600 transition"
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
        <div className="relative inline-block text-left">
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-2 border-gray-200 bg-white text-sm px-4 py-2 pr-8 rounded-lg hover:bg-red-500 hover:text-white transition focus:outline-none appearance-none"
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

      {/* Product Grid */}
      <div className="container max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <p className="text-center py-10">Đang tải sản phẩm...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">Lỗi: {error}</p>
        ) : products.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
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

export default WomenProductsPage;
