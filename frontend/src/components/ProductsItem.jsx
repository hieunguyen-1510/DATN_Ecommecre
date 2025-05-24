import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProductsItem = ({ id, image, name, price }) => { 
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={image && image[0] ? image[0] : "https://placehold.co/600x800/E0E0E0/6C6C6C?text=No+Image"} 
          alt={name || "Product"}
          className="w-full h-64 object-cover hover:scale-110 transition ease-in-out duration-300"
        />
      </div>
      {/* Thêm padding cho tên và giá */}
      <div className="p-4"> {/* Thêm div bọc và padding */}
        <p className="pt-1 pb-1 text-base font-semibold text-gray-800">{name}</p>
        <p className="text-lg font-bold text-orange-500"> 
          {price.toLocaleString("vi-VN")} {currency}
        </p>
      </div>
    </Link>
  );
};

export default ProductsItem;
