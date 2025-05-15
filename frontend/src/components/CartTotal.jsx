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
    <div className="w-full p-4 rounded-md bg-gray-50">
      <div className="text-xl font-semibold mb-4">
        <Title text1="TỔNG" text2="GIỎ HÀNG" />
      </div>
      <div className="space-y-4 text-sm">
        {/* Tổng giá trị sản phẩm */}
        <div className="flex justify-between border-b pb-2">
          <p>Tạm tính</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>
        {/* Phí giao hàng */}
        <div className="flex justify-between border-b pb-2">
          <p>Phí giao hàng</p>
          <p>{formatCurrency(delivery_fee)}</p>
        </div>
        {/* Tổng cộng */}
        <div className="flex justify-between font-semibold text-lg text-gray-800">
          <p>Tổng cộng</p>
          <p>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;