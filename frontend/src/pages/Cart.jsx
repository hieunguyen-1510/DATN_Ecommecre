import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
    // console.log("Cart Data:", tempData); 
  }, [cartItems]);

  return (
    <div className="border-t pt-14 bg-gray-50 min-h-[80vh]">
      {/* Title Section */}
      <div className="text-3xl mb-8 text-center">
        <Title text1="GIỎ" text2="HÀNG" />
      </div>

      {/* Cart Items Section */}
      <div className="max-w-5xl mx-auto px-4">
        {cartData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData || !productData.image || productData.image.length === 0) {
              console.log(`Product not found or missing image for _id: ${item._id}`); // Debug
              return null; // Skip rendering if product or image is missing
            }

            return (
              <div
                key={index}
                className="py-4 border-b bg-white shadow-sm text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_1.5fr_0.5fr] items-center gap-4 px-6 rounded-lg mb-4 hover:shadow-md transition-shadow"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={productData.image[0] || assets.placeholder_image || "/placeholder.jpg"}
                    alt={productData.name || "Product"}
                    className="w-16 sm:w-20 rounded-lg border border-gray-200"
                  />
                  <div>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <p className="text-red-600 font-semibold text-base">
                        {productData.price.toLocaleString("vi-VN")} {currency}
                      </p>
                      <p className="px-3 py-1 border rounded-full bg-gray-100 text-gray-600">
                        Size: {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  type="number"
                  min={1}
                  value={item.quantity}
                  className="border px-3 py-1 text-center w-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Delete Button */}
                <button
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <img src={assets.bin_icon} alt="Thùng rác" className="w-5 sm:w-6" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Total Section */}
      {cartData.length > 0 && (
        <div className="flex justify-end my-10 px-4">
          <div className="w-full sm:w-[450px] bg-white p-6 rounded-lg shadow-md">
            <CartTotal />
            <div className="w-full text-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm my-8 px-8 py-3 rounded-lg uppercase font-semibold transition-colors"
                onClick={() => navigate("/place-order")}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;