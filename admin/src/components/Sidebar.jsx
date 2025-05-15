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
} from "@ant-design/icons";

const Sidebar = ({ setToken }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Admin");
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const unreadCount = 3;
    setNotificationCount(unreadCount);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    notification.info({ message: "Bạn đã đăng xuất thành công!" });
    navigate("/login");
  };

  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 text-base font-medium ${
      isActive
        ? "bg-blue-600 text-white shadow"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <>
      <button
        className="md:hidden fixed top-5 left-5 z-50 text-white bg-gray-800 p-3 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuOutlined className="text-2xl" />
      </button>

      <aside
        className={`bg-[#0f172a] text-white w-72 min-h-screen shadow-2xl rounded-r-2xl flex flex-col fixed top-0 left-0 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static z-40`}
      >
        <div className="p-6 border-b border-slate-700 flex flex-col items-center gap-2">
          <img
            src={adminLogo}
            alt="Admin Logo"
            className="w-16 h-16 rounded-full shadow-md object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/64")}
          />
          <h2 className="text-xl font-bold mt-2">Admin Dashboard</h2>
          <p className="text-sm text-slate-400">{username}</p>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-4">
          <div>
            <h3 className="text-xs uppercase text-slate-400 font-semibold px-2 mb-3">
              Quản lý
            </h3>
            {[
              {
                path: "/statistics",
                label: "Thống kê",
                icon: <BarChartOutlined />,
              },
              { path: "/users", label: "Người Dùng", icon: <UserOutlined /> },
              {
                path: "/products",
                label: "Sản phẩm",
                icon: <AppstoreOutlined />,
              },
              {
                path: "/vouchers",
                label: "Mã giảm giá",
                icon: <GiftOutlined />,
              },
              { path: "/banners", label: "Banner", icon: <PictureOutlined /> },
              { path: "/reviews", label: "Đánh giá", icon: <StarOutlined /> },
              {
                path: "/inventory",
                label: "Tồn kho",
                icon: <DatabaseOutlined />,
              },
              {
                path: "/orders",
                label: "Đơn hàng",
                icon: <ContainerOutlined />,
              },
              {
                path: "/payments",
                label: "Thanh toán",
                icon: <ShoppingCartOutlined />,
              },
            ].map(({ path, label, icon }) => (
              <NavLink key={path} to={path} className={navLinkStyles}>
                <span className="text-lg">{icon}</span>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-5 mt-5">
            <h3 className="text-xs uppercase text-slate-400 font-semibold px-2 mb-3">
              Hệ thống
            </h3>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 text-base font-medium text-slate-300 hover:bg-red-600 hover:text-white w-full"
            >
              <LogoutOutlined className="text-lg" />
              Đăng Xuất
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
