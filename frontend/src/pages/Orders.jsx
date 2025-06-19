import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaEye, FaTimesCircle } from "react-icons/fa";
import CancelConfirmationModal from "../components/CancelConfirmationModal";

const Orders = () => {
  const { backendUrl, token, currency, navigate, delivery_fee } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancelId, setOrderToCancelId] = useState(null);

  const refreshOrderStatus = async (orderId) => {
    try {
      setLoadingOrderId(orderId);
      const { data } = await axios.get(
        `${backendUrl}/api/orders/${orderId}/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: data.status } : order
        )
      );
      toast.success("Đã cập nhật trạng thái mới nhất!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancelId(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async (reason) => {
    if (!orderToCancelId) return;
    try {
      setCancellingOrderId(orderToCancelId);
      setShowCancelModal(false);
      const response = await axios.put(
        `${backendUrl}/api/orders/cancel/${orderToCancelId}`,
        { cancelReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderToCancelId ? { ...order, status: "Cancelled" } : order
          )
        );
        toast.success("Đơn hàng đã được hủy thành công!");
      } else {
        toast.error(response.data.message || "Không thể hủy đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancellingOrderId(null);
      setOrderToCancelId(null);
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
          const sortedOrders = data.orders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        } else {
          console.error(data.message);
          toast.error("Không thể tải danh sách đơn hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        toast.error("Có lỗi xảy ra khi tải đơn hàng.");
      }
    };
    if (token) fetchOrders();
  }, [backendUrl, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 text-green-600";
      case "Cancelled":
        return "bg-red-500 text-red-600";
      case "Processing":
        return "bg-blue-500 text-blue-600";
      case "Shipped":
        return "bg-purple-500 text-purple-600";
      default:
        return "bg-yellow-500 text-yellow-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Order Placed":
        return "Đang xử lý";
      case "Processing":
        return "Đang xử lý";
      case "Shipped":
        return "Đang giao hàng";
      case "Delivered":
        return "Đã giao hàng";
      case "Cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const calculateOrderTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const canCancelOrder = (status) =>
    status === "Order Placed" || status === "Processing";

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="text-center pb-12">
        <Title text1="ĐƠN" text2="HÀNG" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-600 text-xl mb-6">Bạn chưa có đơn hàng nào.</p>
            <button
              onClick={() => navigate("/collection")}
              className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              {/* Header */}
              <div className="border-b pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Mã đơn hàng:{" "}
                  <span className="text-orange-600">
                    {order._id.substring(0, 8).toUpperCase()}
                  </span>
                </h3>
                <p className="text-gray-600 text-sm">
                  Ngày đặt:{" "}
                  <span className="font-semibold">
                    {dayjs(order.createdAt).format("DD [tháng] MM,YYYY")}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:pb-0 last:border-b-0"
                  >
                    <img
                      src={
                        item.productId?.image?.[0] ||
                        "https://placehold.co/80x100/E0E0E0/6C6C6C?text=No+Image"
                      }
                      className="w-full sm:w-20 h-auto sm:h-24 object-cover rounded-lg border border-gray-200"
                      alt={item.productId?.name || "Sản phẩm"}
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/80x100/E0E0E0/6C6C6C?text=No+Image")
                      }
                    />
                    <div className="flex flex-col flex-grow">
                      <p className="text-base font-semibold text-gray-900">
                        {item.productId?.name || "Sản phẩm đã bị xóa"}
                      </p>
                      <p className="text-gray-600 text-sm">Size: {item.size}</p>
                      <p className="text-gray-600 text-sm">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-orange-500 font-bold text-base mt-1">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} {currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full ${getStatusColor(order.status).split(" ")[0]}`}
                  ></span>
                  <p
                    className={`font-semibold text-base sm:text-lg ${getStatusColor(order.status).split(" ")[1]}`}
                  >
                    Trạng thái: {getStatusText(order.status)}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                 <p className="text-lg font-bold text-gray-900 text-center sm:text-left">
                  Tổng cộng:{" "}
                  <span className="text-orange-600">
                    {(calculateOrderTotal(order.items) + delivery_fee).toLocaleString("vi-VN")} {currency}
                  </span>
                </p>
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => handleCancelClick(order._id)}
                      disabled={cancellingOrderId === order._id}
                      className="px-4 py-2 w-full sm:w-auto bg-red-500 text-white rounded-full flex items-center justify-center gap-2 text-sm font-bold hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {cancellingOrderId === order._id ? (
                        <>
                          <FaSpinner className="animate-spin" /> Đang hủy...
                        </>
                      ) : (
                        <>
                          <FaTimesCircle /> Hủy đơn
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => refreshOrderStatus(order._id)}
                    disabled={loadingOrderId === order._id}
                    className="px-4 py-2 w-full sm:w-auto bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center gap-2 text-sm font-bold hover:bg-orange-500 transition disabled:opacity-50"
                  >
                    {loadingOrderId === order._id ? (
                      <>
                        <FaSpinner className="animate-spin" /> Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <FaEye /> Theo dõi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal xác nhận */}
      <CancelConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelOrder}
        orderId={orderToCancelId}
      />
    </div>
  );
};

export default Orders;
