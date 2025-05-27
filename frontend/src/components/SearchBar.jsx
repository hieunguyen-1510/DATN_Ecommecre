import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  return showSearch ? (
    <div className="border-t border-b bg-gray-50 text-center py-3">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-2 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 outline-none bg-transparent text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img src={assets.search_icon} alt="Search Icon" className="w-4" />
      </div>
      <img
        src={assets.cross_icon}
        alt="Close Icon"
        className="inline w-4 cursor-pointer ml-2"
        onClick={() => {
          setShowSearch(false);
          setSearch(""); // xoa sau khi search xong
        }}
      />
    </div>
  ) : null;
};

export default SearchBar;