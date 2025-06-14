import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { notification } from "antd"; 
import adminLogo from "../assets/admin-logo.png"; 

import {
  BarChartOutlined,
  UserOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  MenuOutlined,
  DatabaseOutlined,
  GiftOutlined,
  PictureOutlined,
  TeamOutlined
} from "@ant-design/icons";

const Sidebar = ({ setToken }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [notificationCount, setNotificationCount] = useState(0); 

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Admin");
    // Giả lập fetch notifications
    const fetchNotifications = async () => {
    
      const unreadCount = 3;
      setNotificationCount(unreadCount);
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    notification.info({ message: "Bạn đã đăng xuất thành công!" });
    navigate("/login");
  };

  // Cập nhật styles cho NavLink
  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all duration-300 text-base font-medium 
     ${isActive
        ? "bg-blue-600 text-white shadow-md border-l-4 border-blue-400 -ml-4 pl-4" 
        : "text-slate-300 hover:bg-slate-800 hover:text-white" 
     }`;

  return (
    <>
      {/* Nút mở Sidebar cho mobile */}
      <button
        className="md:hidden fixed top-5 left-5 z-50 text-white bg-gray-800 p-3 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở menu"
      >
        <MenuOutlined className="text-2xl" />
      </button>

      {/* Sidebar chính */}
      <aside
        className={`bg-[#0f172a] text-white w-72 min-h-screen shadow-2xl rounded-r-2xl flex flex-col fixed top-0 left-0 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static z-40 overflow-y-auto`}
      >
        {/* Header của Sidebar (Logo và thông tin Admin) */}
        <div className="p-6 border-b border-slate-700 flex flex-col items-center gap-2">
          <img
            src={adminLogo}
            alt="Admin Logo"
            className="w-20 h-20 rounded-full shadow-md object-cover border-2 border-slate-600" 
            onError={(e) => (e.target.src = "https://placehold.co/80x80/334155/E2E8F0?text=Admin")} 
          />
          <h2 className="text-2xl font-bold mt-3 text-slate-100">Admin Panel</h2> 
          <p className="text-base text-slate-400">{username}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-5"> 
          <div>
            <h3 className="text-xs uppercase text-slate-400 font-semibold px-2 mb-3 tracking-wider">
              Quản lý
            </h3>
            {[
              { path: "/statistics", label: "Thống kê", icon: <BarChartOutlined /> },
              { path: "/users", label: "Người Dùng", icon: <UserOutlined /> },
              { path: "/customers", label: "Khách hàng", icon: <TeamOutlined /> },
              { path: "/products", label: "Sản phẩm", icon: <AppstoreOutlined /> },
              { path: "/discounts", label: "Mã giảm giá", icon: <GiftOutlined /> },
              { path: "/banners", label: "Banner", icon: <PictureOutlined /> },
              { path: "/reviews", label: "Đánh giá", icon: <StarOutlined /> },
              { path: "/inventory", label: "Tồn kho", icon: <DatabaseOutlined /> },
              { path: "/orders", label: "Đơn hàng", icon: <ContainerOutlined /> },
              { path: "/payments", label: "Thanh toán", icon: <ShoppingCartOutlined /> },
            ].map(({ path, label, icon }) => (
              <NavLink key={path} to={path} className={navLinkStyles}>
                <span className="text-xl">{icon}</span> 
                {label}
              </NavLink>
            ))}
          </div>

          {/* System Links */}
          <div className="border-t border-slate-700 pt-5 mt-5">
            <h3 className="text-xs uppercase text-slate-400 font-semibold px-2 mb-3 tracking-wider">
              Hệ thống
            </h3>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all duration-300 text-base font-medium text-slate-300 hover:bg-red-600 hover:text-white w-full"
            >
              <LogoutOutlined className="text-xl" /> 
              Đăng Xuất
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay khi Sidebar mở trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true" 
        />
      )}
    </>
  );
};

export default Sidebar;
