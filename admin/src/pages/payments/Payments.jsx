import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { backendUrl } from "../../App";
import "react-toastify/dist/ReactToastify.css";

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        toast.error("Không thể tải danh sách thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/payments/update`,
        { orderId, paymentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { payment, order } = response.data;

      toast.success("Cập nhật trạng thái thanh toán thành công!");

      setOrders((prev) =>
        prev.map((item) =>
          item._id === orderId
            ? {
                ...item,
                paymentStatus: payment.status,
                status: order.status,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="loader border-4 border-green-500 border-t-transparent w-10 h-10 rounded-full animate-spin mx-auto mb-2"></div>
        <p>Đang tải danh sách thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer />
      <header className="bg-green-600 text-white p-4 text-center rounded-md mb-6 shadow-lg">
        <h1 className="text-2xl font-bold">Quản lý Thanh Toán</h1>
        <p className="text-sm opacity-90 mt-1">Xem và quản lý trạng thái các giao dịch thanh toán</p>
      </header>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương Thức</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Thanh Toán</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Đơn</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 truncate max-w-[120px]">
                  {order._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.userId?.name || "Ẩn danh"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {order.paymentMethod || "Không rõ"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  {order.totalAmount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                    value={order.paymentStatus || "pending"}
                    className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      order.paymentStatus === "completed"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : order.paymentStatus === "pending"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : order.paymentStatus === "failed"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <option value="pending">Đang chờ</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="failed">Thất bại</option>
                    <option value="refunded">Hoàn tiền</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Order Placed"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Payments;