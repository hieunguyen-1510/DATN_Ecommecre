import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Product from "./pages/products/Product";
import Order from "./pages/orders/Order";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "@ant-design/v5-patch-for-react-19";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import UserList from "./pages/users/UserList";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import UserDetail from "./pages/users/UserDetail";
import Reviews from "./pages/reviews/Reviews";
import Payments from "./pages/payments/Payments";
import Statistics from "./components/Statistics";
import Inventory from "./pages/products/Inventory";
import OrderDetail from "./pages/orders/OrderDetail";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "đ";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
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
          <Route path="statistics" element={<Statistics token={token} />} />
          <Route path="add-product" element={<AddProduct token={token} />} />
          <Route path="edit-product/:id" element={<EditProduct token={token} />} />
          <Route path="products" element={<Product token={token} />} />
          <Route path="inventory" element={<Inventory token={token} />} />
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
