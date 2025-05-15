import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrderId,setLoadingOrderId] = useState(null);

   // Hàm cập nhật trạng thái đơn hàng
  const refreshOrderStatus = async (orderId) => {
  try {
    setLoadingOrderId(orderId);
    // GET status
    const { data } = await axios.get(
      `${backendUrl}/api/orders/${orderId}/status`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId ? { ...order, status: data.status } : order
      )
    );
    toast.success("Đã cập nhật trạng thái mới nhất!");
  } catch (error) {
    toast.error("Không thể cập nhật trạng thái");
  } finally {
    setLoadingOrderId(null);
  }
};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/orders/user-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [backendUrl, token]);

 return (
    <div className="border-t pt-16 bg-gray-50 min-h-[80vh] px-6">
      <ToastContainer />
      <div className="text-2xl mb-8 text-center">
        <Title text1="ĐƠN" text2="HÀNG" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Bạn chưa có đơn hàng nào.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="py-4 border-t border-b bg-white shadow-md text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 text-sm">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-start gap-4">
                    <img
                      src={item.productId.image[0]}
                      className="w-16 sm:w-20 rounded-lg border border-gray-200"
                      alt={item.productId.name}
                    />
                    <div className="flex flex-col gap-1">
                      <p className="sm:text-base font-semibold text-gray-900">
                        {item.productId.name}
                      </p>
                      <p className="text-red-600 font-semibold">
                        {item.price.toLocaleString("vi-VN")} {currency}
                      </p>
                      <p className="text-gray-600">Số lượng: {item.quantity}</p>
                      <p className="text-gray-600">Kích thước: {item.size}</p>
                      <p className="text-gray-600">
                        Ngày đặt:{" "}
                        <span className="text-gray-400">
                          {dayjs(order.date).format("DD [tháng] MM, YYYY")}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Trạng thái và nút theo dõi đơn hàng */}
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    order.status === "Delivered" ? "bg-green-500" :
                    order.status === "Cancelled" ? "bg-red-500" : 
                    "bg-yellow-500"
                  }`}></span>
                  <p className={`text-sm ${
                    order.status === "Delivered" ? "text-green-600" :
                    order.status === "Cancelled" ? "text-red-600" : 
                    "text-yellow-600"
                  }`}>
                    {{
                      'Order Placed': 'Đang chờ xử lý',
                      'Processing': 'Đang xử lý',
                      'Shipped': 'Đang giao hàng',
                      'Delivered': 'Đã giao hàng',
                      'Cancelled': 'Đã hủy'
                    }[order.status]}
                  </p>
                </div>

                <button 
                  onClick={() => refreshOrderStatus(order._id)}
                  disabled={loadingOrderId === order._id}
                  className="border border-blue-500 text-blue-500 px-4 py-2 
                    text-sm rounded-lg hover:bg-blue-50 flex items-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingOrderId === order._id ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 
                        border-t-transparent rounded-full"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    "Theo dõi đơn hàng"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;