import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const SearchResultDropdown = () => {
  const {search, searchResults, setShowSearch, setSearch,currency,isSearching} = useContext(ShopContext);

  // nếu không có từ khóa tìm kiếm
  if (!search || (searchResults.length === 0 && !isSearching)) {
    return null;
  }

  const handleProductClick = () => {
    setShowSearch(false);
    setSearch("");
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border border-gray-200 shadow-lg rounded-b-lg overflow-hidden z-40">
      {isSearching && searchResults.length === 0 && (
        <p className="p-3 text-center text-gray-500">Đang tìm kiếm...</p>
      )}

      {!isSearching && searchResults.length === 0 && search && (
        <p className="p-3 text-center text-gray-500">
          Không tìm thấy sản phẩm nào cho "{search}".
        </p>
      )}

      {searchResults.length > 0 && (
        <div className="max-h-80 overflow-y-auto">
          {searchResults.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
              onClick={handleProductClick}
            >
              <img
                src={
                  product.image && product.image.length > 0
                    ? product.image[0]
                    : assets.no_image_available
                }
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600">
                  {(product.finalPrice || product.price).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  {currency}
                  {product.finalPrice && product.finalPrice < product.price && (
                    <span className="ml-2 text-red-500 line-through">
                      {product.price.toLocaleString("vi-VN")} {currency}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Nút "Xem tất cả" */}
      {/* {searchResults.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <Link
            to={`/search-results?q=${search}`}
            className="text-blue-600 hover:underline"
            onClick={handleProductClick}
          >
            Xem tất cả kết quả cho "{search}"
          </Link>
        </div>
      )} */}
    </div>
  );
};

export default SearchResultDropdown;
