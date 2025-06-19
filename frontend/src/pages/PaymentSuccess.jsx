import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { backendUrl, clearCart, token } = useContext(ShopContext);

  // Lấy orderId từ query param
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      navigate("/");
      return;
    }

    if (!token) {
      
      return;
    }

    // Gọi API kiểm tra trạng thái thanh toán
    axios
      .get(`${backendUrl}/api/payment/${orderId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("check:", res.data);
        if (res.data.status === "completed") {
          toast.success("Thanh toán thành công!");
          clearCart(true); 
        } else {
          console.log("log err: ", res.data);
          toast.error("Thanh toán chưa hoàn tất hoặc thất bại");
          navigate("/payment-fail");
        }
      })
      .catch(() => {
        toast.error("Lỗi khi kiểm tra trạng thái thanh toán");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [orderId, navigate, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Đang xử lý thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center px-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Cảm ơn bạn đã thanh toán!
      </h2>
      <p className="text-gray-700 mb-6">
        Đơn hàng của bạn đã được xử lý thành công.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default PaymentSuccess;
