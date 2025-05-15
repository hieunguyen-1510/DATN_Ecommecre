import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProductsItem = ({ id, image, name, price, isNew }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="relative overflow-hidden rounded-xl">
        {/* "New" Badge */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-lg">
            New
          </span>
        )}
        <img
          src={image && image[0] ? image[0] : "placeholder-image-url"}
          alt={name || "Product"}
          className="w-full h-64 object-cover hover:scale-110 transition ease-in-out duration-300"
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium text-red-500">
        {price.toLocaleString("vi-VN")} {currency}
      </p>
    </Link>
  );
};

export default ProductsItem;
