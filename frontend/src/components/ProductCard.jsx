import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import AddToCartSuccessModal from "./AddToCartSuccessModal";
const ProductCard = ({ product }) => {
  const [showSizes, setShowSizes] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { addToCart, currency } = useContext(ShopContext);

  const handleAddToCartClick = async (e, size) => {
    e.stopPropagation();
    await addToCart(product._id, size);
    if (size || !product.sizes?.length) {
      setShowSuccessModal(true);
    } else {
      toast.error("Vui lòng chọn size sản phẩm!");
    }
    setShowSizes(false);
  };

  const handleToggleSizes = (e) => {
    e.stopPropagation();
    setShowSizes(!showSizes);
  };

  const hasPercent = product.discountPercentage > 0;
  const hasFixed = product.discountAmount > 0;
  const isDiscounted = hasPercent || hasFixed;

  let displayPrice = product.price;
  if (hasPercent) {
    displayPrice = product.finalPrice;
  } else if (hasFixed) {
    displayPrice = product.price - product.discountAmount;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden relative cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={
              product.image && product.image[0]
                ? product.image[0]
                : "https://placehold.co/600x800/E0E0E0/6C6C6C?text=No+Image"
            }
            alt={product.name || "Product Image"}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {hasPercent && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full shadow-md z-10">
              -{product.discountPercentage}%
            </span>
          )}
          {!hasPercent && hasFixed && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full shadow-md z-10">
              -{product.discountAmount.toLocaleString("vi-VN")} {currency}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-5 relative flex flex-col gap-2">
        <h3 className="text-gray-900 text-sm sm:text-base font-semibold flex items-center justify-between">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis pr-2"
          >
            {product.name}
          </Link>
          <button
            onClick={handleToggleSizes}
            className="p-2 rounded-full bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition transform hover:scale-110"
            aria-label="Thêm vào giỏ hàng"
          >
            <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </h3>

        <p className="text-sm sm:text-base font-bold">
          {isDiscounted && (
            <span className="text-gray-400 line-through mr-2">
              {product.price.toLocaleString("vi-VN")} {currency}
            </span>
          )}
          <span className="text-orange-500">
            {displayPrice.toLocaleString("vi-VN")} {currency}
          </span>
        </p>

        {showSizes && (
          <div className="absolute right-4 bottom-20 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 min-w-[100px]">
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleAddToCartClick(e, size)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {size}
                </button>
              ))
            ) : (
              <button
                onClick={(e) => handleAddToCartClick(e, null)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Thêm vào giỏ
              </button>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-0 border-2 border-transparent hover:border-yellow-500 rounded-xl transition-colors duration-300 pointer-events-none z-0" />
      {/* Thêm Modal thành công */}
      <AddToCartSuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </motion.div>
  );
};

export default ProductCard;
