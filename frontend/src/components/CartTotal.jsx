import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal > 0 ? subtotal + delivery_fee : 0;

  // Hàm định dạng tiền theo chuẩn Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " " + currency;
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-white shadow-xl">
      <div className="text-xl font-semibold mb-4">
        <Title text1="TỔNG" text2="GIỎ HÀNG" />
      </div>
      <div className="space-y-4 text-base">
        {/* Tổng giá trị sản phẩm */}
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <p className="text-gray-700">Tạm tính</p>
          <p className="font-semibold text-gray-800">
            {formatCurrency(subtotal)}
          </p>
        </div>
        {/* Phí giao hàng */}
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <p className="text-gray-700">Phí giao hàng</p>
          <p className="font-semibold text-gray-800">
            {formatCurrency(delivery_fee)}
          </p>
        </div>
        {/* Tổng cộng */}
        <div className="flex justify-between font-bold text-xl text-orange-600 pt-2">
          <p>Tổng cộng</p>
          <p>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
