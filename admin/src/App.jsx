import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import ProductManagement from "./pages/products/ProductManagement";
import Order from "./pages/orders/Order";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@ant-design/v5-patch-for-react-19";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import UserList from "./pages/users/UserList";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import UserDetail from "./pages/users/UserDetail";
import Reviews from "./pages/reviews/Reviews";
import Payments from "./pages/payments/Payments";
import InventoryManagement from "./pages/inventory/InventoryManagement";
import OrderDetail from "./pages/orders/OrderDetail";
import BannerManagement from "./pages/banner/BannerManagement";
import DiscountManagement from "./pages/discount/DiscountManagement";
import StatisticDashboard from "./pages/statistics/StatisticsDashboard";
import CustomerList from "./components/CustomerList";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "đ";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/"
          element={
            token ? (
              <div className="flex w-full">
                <Sidebar setToken={setToken} />
                <div className="w-full md:w-[70%] mx-auto md:ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                  <Outlet />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="statistics" element={<StatisticDashboard token={token} />} />
          <Route path="add-product" element={<AddProduct token={token} />} />
          <Route path="/customers" element={<CustomerList token={token}/>} />
          <Route path="edit-product/:id" element={<EditProduct token={token} />} />
          <Route path="products" element={<ProductManagement token={token} />} />
          <Route path="discounts" element={<DiscountManagement token={token} />} />
          <Route path="banners" element={<BannerManagement token={token} />} />
          <Route path="inventory" element={<InventoryManagement token={token} />} />
          <Route path="orders" element={<Order token={token} />} />
          <Route path="orders/:orderId" element={<OrderDetail token={token} />} />
          <Route path="users" element={<UserList token={token} />} />
          <Route path="users/:id" element={<UserDetail token={token} />} />
          <Route path="users/edit/:id" element={<EditUser token={token} />} />
          <Route path="users/add" element={<AddUser token={token} />} />
          <Route path="reviews" element={<Reviews token={token} />} />
          <Route path="payments" element={<Payments token={token} />} />
        </Route>
      </Routes>
    </div>
  )};

export default App;
