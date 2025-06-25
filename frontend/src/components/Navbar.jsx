import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";
import { toast } from "react-toastify";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  // const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    user,
    setSearch,
  } = useContext(ShopContext);

  const logout = () => {
    toast.success("Bạn đã đăng xuất thành công!");
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    setSearch("");
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between py-5 font-medium">
        <Link to="/">
          <img src={assets.logo} className="w-28" alt="Logo" />
        </Link>
        <ul className="hidden sm:flex gap-5 text-base text-gray-700">
          <NavLink to="/" className="group flex flex-col items-center gap-1">
            <p>TRANG CHỦ</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
          </NavLink>
          <NavLink
            to="/collection"
            className="group flex flex-col items-center gap-1"
          >
            <p>BỘ SƯU TẬP</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
          </NavLink>
          <NavLink
            to="/about"
            className="group flex flex-col items-center gap-1"
          >
            <p>GIỚI THIỆU</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
          </NavLink>
          <NavLink
            to="/contact"
            className="group flex flex-col items-center gap-1"
          >
            <p>LIÊN HỆ</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
          </NavLink>
        </ul>
        <div className="flex items-center gap-6">
          <img
            className="w-5 cursor-pointer"
            src={assets.search_icon}
            alt="Tìm kiếm"
            onClick={handleSearchClick}
          />
          {/* Biểu tượng chuông thông báo */}
          {/* <div className="relative">
            <img
              className="w-6 cursor-pointer"
              src={assets.notification_icon}
              alt="Thông báo"
            /> */}
          {/* Số lượng thông báo chưa đọc */}
          {/* {unreadNotificationsCount > 0 && (
              <p className="absolute right-[-5px] top-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px]">
                {unreadNotificationsCount}
              </p>
            )}
          </div> */}
          <div className="group relative">
            {token ? (
              <img
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                src={user?.avatar || assets.profile}
                alt="Avatar"
              />
            ) : (
              <img
                onClick={() => navigate("/login")}
                className="w-5 cursor-pointer"
                src={assets.profile_icon}
                alt="Tài khoản"
              />
            )}
            {token && (
              <div className="hidden group-hover:block absolute right-0 pt-4 z-10">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer hover:text-black"
                  >
                    Hồ sơ của tôi
                  </p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Đơn hàng
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img
              className="w-5 min-w-5"
              src={assets.cart_icon}
              alt="Giỏ hàng"
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
          <img
            onClick={() => setVisible(true)}
            className="w-5 cursor-pointer sm:hidden"
            src={assets.menu_icon}
            alt="Menu"
          />
        </div>
        {/* Overlay đen mờ */}
        {visible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
            onClick={() => setVisible(false)}
          />
        )}

        {/* Sidebar trượt từ phải ra */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out sm:hidden
      ${visible ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-3 cursor-pointer"
            >
              <img className="w-5" src={assets.close_icon} alt="Close" />
            </div>
            <NavLink to="/" className="py-3 px-6 hover:bg-gray-200">
              TRANG CHỦ
            </NavLink>
            <NavLink to="/collection" className="py-3 px-6 hover:bg-gray-200">
              BỘ SƯU TẬP
            </NavLink>
            <NavLink to="/about" className="py-3 px-6 hover:bg-gray-200">
              GIỚI THIỆU
            </NavLink>
            <NavLink to="/contact" className="py-3 px-6 hover:bg-gray-200">
              LIÊN HỆ
            </NavLink>
          </div>
        </div>
      </div>
      <SearchBar />
    </div>
  );
};

export default Navbar;