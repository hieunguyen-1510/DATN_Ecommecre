import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { motion } from "framer-motion";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size: size,
            quantity: cartItems[productId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 py-16"
    >
      <div className="container max-w-7xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center pb-12">
          <Title text1="GIỎ" text2="HÀNG" />
        </div>

        {cartData.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-600 text-xl mb-6">
              Giỏ hàng của bạn đang trống.
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
              {/* Header của bảng */}
              <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] sm:grid-cols-[2.5fr_1fr_1fr_0.5fr] md:grid-cols-[3fr_1fr_1fr_0.5fr] gap-4 py-4 px-6 border-b-2 border-gray-200 font-semibold text-gray-700 uppercase text-sm md:text-base">
                <p>Tên sản phẩm</p>
                <p className="text-center">Số lượng</p>
                <p className="text-right">Tổng tiền</p>
                <p className="text-center">Xóa</p>
              </div>

              {/* Danh sách sản phẩm trong giỏ */}
              {cartData.map((item) => {
                const productData = products.find(
                  (product) => product._id === item._id
                );
                if (!productData) {
                  console.warn(`Product data not found for ID: ${item._id}`);
                  return null;
                }

                // Logic xu ly ma giam gia
                const isDiscounted = productData.discountPercentage && productData.discountPercentage > 0;
                const priceToUse = isDiscounted ? productData.finalPrice : productData.price;
                const itemTotalPrice = priceToUse * item.quantity;

                // const itemTotalPrice = productData.price * item.quantity;
                
                return (
                  <div
                    key={`${item._id}-${item.size}`}
                    className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] sm:grid-cols-[2.5fr_1fr_1fr_0.5fr] md:grid-cols-[3fr_1fr_1fr_0.5fr] items-center gap-4 py-4 px-6 border-b border-gray-100 text-gray-800 text-sm md:text-base"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={
                            productData.image[0] ||
                            "https://placehold.co/80x100/E0E0E0/6C6C6C?text=No+Image"
                          }
                          alt={productData.name}
                          className="w-20 h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/product/${item._id}`}
                          className="font-semibold text-gray-900 hover:text-yellow-600 transition-colors block mb-1"
                        >
                          {productData.name}
                        </Link>
                        <p className="text-gray-600 text-xs">
                          Size: {item.size}
                        </p>
                        <p className="text-sm mt-1">
                          {isDiscounted && (
                            <span className="text-gray-500 line-through mr-2 font-normal">
                              {productData.price.toLocaleString("vi-VN")} {currency}
                            </span>
                          )}
                            <span className="text-orange-500 font-bold">
                              {priceToUse.toLocaleString("vi-VN")} {currency}
                            </span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FaMinus className="w-4 h-4 text-gray-700" />
                      </button>
                      <input
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value > 0 || e.target.value === "") {
                            updateQuantity(item._id, item.size, value);
                          }
                        }}
                        type="number"
                        min={1}
                        value={item.quantity}
                        className="border border-gray-300 px-2 py-1 text-center w-12 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.quantity + 1)
                        }
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <FaPlus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Total Price for Item */}
                    <p className="text-right font-bold text-orange-600 text-base">
                      {itemTotalPrice.toLocaleString("vi-VN")} {currency}
                    </p>

                    {/* Delete Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                        aria-label="Xóa sản phẩm"
                      >
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Total */}
            <div className="w-full lg:w-1/3">
              <CartTotal />
              <div className="w-full text-center mt-6">
                <button
                  className="w-full px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => navigate("/place-order")}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
