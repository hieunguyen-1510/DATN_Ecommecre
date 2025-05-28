import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
// import AddToCartSuccessModal from "./AddToCartSuccessModal";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const [showSizes, setShowSizes] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { addToCart, currency } = useContext(ShopContext);

  const handleAddToCartClick = async (e, size) => {
    e.stopPropagation(); // NGĂN CHẶN SỰ KIỆN CLICK LAN TRUYỀN LÊN THẺ CHA (Link)
    await addToCart(product._id, size);
    if (size) {
      setShowSuccessModal(true);
      // toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    } else {
      toast.error("Vui lòng chọn size sản phẩm!");
    }
    setShowSizes(false);
  };

  const handleToggleSizes = (e) => {
    e.stopPropagation();
    setShowSizes(!showSizes);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden relative cursor-pointer transform hover:-translate-y-2 transition-all duration-300 ease-in-out"
    >
      {/* BỌC TOÀN BỘ CARD BẰNG LINK NGOẠI TRỪ CÁC PHẦN CÓ INTERACTION RIÊNG */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={
              product.image && product.image[0]
                ? product.image[0]
                : "https://placehold.co/600x800/E0E0E0/6C6C6C?text=No+Image"
            } // Thêm placeholder
            alt={product.name || "Product Image"}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5 relative">
        <h3 className="text-gray-900 text-base font-bold mb-2 flex items-center justify-between">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis pr-2"
          >
            {product.name}
          </Link>

          <button
            onClick={handleToggleSizes}
            className="p-2 rounded-full bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition-colors transform hover:scale-110"
            aria-label="Thêm vào giỏ hàng"
          >
            <FiShoppingCart className="h-5 w-5" />
          </button>
        </h3>
        <p className="text-orange-500 text-base font-bold">
          {product.price.toLocaleString("vi-VN")} {currency}
        </p>

        {showSizes && (
          <div className="absolute right-5 bottom-20 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 min-w-[100px]">
            {" "}
            {/* Điều chỉnh vị trí, thêm min-width */}
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleAddToCartClick(e, size)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {size}
                </button>
              ))
            ) : (
              <button
                onClick={(e) => handleAddToCartClick(e, null)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Thêm vào giỏ
              </button>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500 rounded-xl transition-colors duration-300 pointer-events-none z-0" />

      {/* Thêm Modal thành công vào cuối component */}
      {/* <AddToCartSuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      /> */}
    </motion.div>
  );
};

export default ProductCard;
