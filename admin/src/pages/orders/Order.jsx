import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import { Link } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/orders/all`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const updateOrderStatus = async (orderId, status) => {
    if (["Cancelled", "Refunded"].includes(status)) {
      const confirm = window.confirm(
        `Bạn có chắc chắn muốn cập nhật đơn hàng này thành "${status}" không?`
      );
      if (!confirm) return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/orders/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Cập nhật trạng thái thành công!");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20">
        <div className="loader border-4 border-green-500 border-t-transparent w-10 h-10 rounded-full animate-spin mx-auto mb-2"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );

  return (
    <div className="p-6">
      <ToastContainer />
      <header className="bg-green-600 text-white p-4 text-center rounded-md mb-6 shadow">
        <h1 className="text-2xl font-bold">Quản lý Đơn Hàng</h1>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-md table-auto">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-3">Mã Đơn</th>
              <th className="px-6 py-3">Người Mua</th>
              <th className="px-6 py-3">Sản Phẩm</th>
              <th className="px-6 py-3">Ngày Đặt</th>
              <th className="px-6 py-3">Trạng Thái</th>
              <th className="px-6 py-3">Tổng Tiền</th>
              <th className="px-6 py-3">Cập Nhật</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{order._id}</td>
                <td className="px-6 py-4">{order.userId?.name || "Ẩn danh"}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <img
                          src={item.productId?.image}
                          alt={item.productId?.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {item.productId?.name}
                          </Link>
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-green-700 font-semibold text-sm">
                  {order.totalAmount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <select
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    value={order.status}
                    className="px-3 py-2 border rounded-md text-sm bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
