import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import { Link } from "react-router-dom";
import OrderStatusConfirmModal from "./OrderStatusConfirmModal"; 
import { FaInfoCircle } from "react-icons/fa";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // States cho modal xác nhận trạng thái
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdateId, setOrderToUpdateId] = useState(null);
  const [newStatusForModal, setNewStatusForModal] = useState("");
  const [currentOrderCancelReason, setCurrentOrderCancelReason] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, backendUrl]);

  // Hàm mở modal xác nhận trạng thái
  const handleStatusChangeClick = (orderId, status, currentReason) => {
    setOrderToUpdateId(orderId);
    setNewStatusForModal(status);
    setCurrentOrderCancelReason(currentReason);
    setShowStatusModal(true);
  };

  // Hàm thực hiện cập nhật trạng thái
  const confirmUpdateOrderStatus = async (
    orderId,
    status,
    cancelReason = ""
  ) => {
    setShowStatusModal(false); // Đóng modal

    try {
      const payload = { orderId, status };
      if (status === "Cancelled") {
        payload.cancelReason = cancelReason;
      }

      const response = await axios.post(
        `${backendUrl}/api/orders/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Cập nhật trạng thái thành công!"
        );
        setOrders((prev) =>
          prev.map(
            (order) =>
              order._id === orderId
                ? {
                    ...order,
                    status,
                    cancelReason:
                      status === "Cancelled"
                        ? cancelReason
                        : order.cancelReason,
                  }
                : order 
          )
        );
      } else {
        toast.error(response.data.message || "Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại"
      );
    } finally {
      setOrderToUpdateId(null);
      setNewStatusForModal("");
      setCurrentOrderCancelReason("");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="loader border-4 border-green-500 border-t-transparent w-10 h-10 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 md:p-6 text-center rounded-lg mb-6 shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold">Quản lý Đơn Hàng</h1>
        <p className="text-sm opacity-90 mt-1">
          Tổng số đơn hàng: {orders.length}
        </p>
      </header>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã Đơn
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách Hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản Phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Đặt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng Tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900 truncate max-w-[120px]">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order._id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {order.userId?.name || "Ẩn danh"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <img
                            src={
                              item.productId?.image?.[0] ||
                              "https://placehold.co/32x32/E0E0E0/6C6C6C?text=No+Image"
                            }
                            alt={item.productId?.name || "Sản phẩm"}
                            className="w-8 h-8 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/32x32/E0E0E0/6C6C6C?text=No+Image";
                            }}
                          />
                          <Link
                            to={`/orders/${order._id}`} 
                            className="text-sm text-blue-600 hover:underline truncate max-w-[150px]"
                          >
                            {item.productId?.name || "Sản phẩm đã xóa"}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "Order Placed"
                        ? "Đang chờ xử lý"
                        : order.status}
                      {/* Hiển thị icon info nếu có lý do hủy */}
                      {order.status === "Cancelled" && order.cancelReason && (
                        <div className="relative group ml-1">
                          <FaInfoCircle className="text-gray-500 cursor-pointer hover:text-gray-700" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                            <p className="font-bold mb-1">Lý do hủy:</p>
                            <p>{order.cancelReason}</p>
                            <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                          </div>
                        </div>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                    {order.totalAmount?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      onChange={(e) =>
                        // Gọi hàm mở modal thay vì update trực tiếp
                        handleStatusChangeClick(
                          order._id,
                          e.target.value,
                          order.cancelReason
                        )
                      }
                      value={order.status}
                      className={`block w-full pl-3 pr-8 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        order.status === "Delivered"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : order.status === "Processing"
                          ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <option value="Processing">Đang xử lý</option>
                      <option value="Shipped">Đang giao</option>
                      <option value="Delivered">Đã giao</option>
                      <option value="Cancelled">Đã hủy</option>
                      <option value="Refunded">Hoàn tiền</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận trạng thái */}
      <OrderStatusConfirmModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmUpdateOrderStatus}
        orderId={orderToUpdateId}
        newStatus={newStatusForModal}
        currentCancelReason={currentOrderCancelReason}
      />
    </div>
  );
};

export default Order;
