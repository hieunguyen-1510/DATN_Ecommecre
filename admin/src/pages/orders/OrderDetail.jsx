import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Modal from 'react-modal';
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    width: '90%',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/orders/detail/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.order);
      } catch (err) {
        toast.error("Không thể tải chi tiết đơn hàng");
      }
    };
    fetchOrder();
  }, [orderId, token]);

  const handleCancel = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/orders/status`,
        { orderId, status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(
        <div>
          <span className="font-medium">✅ Đã hủy đơn hàng thành công!</span>
          <p className="text-sm mt-1">Bạn sẽ được chuyển về trang đơn hàng</p>
        </div>, 
        {
          autoClose: 2000,
          onClose: () => navigate('/orders')
        }
      );

      setOrder({ ...order, status: "Cancelled" });
      setIsCancelModalOpen(false);
      
    } catch (err) {
      toast.error(
        <div>
          <span className="font-medium">❌ Hủy đơn thất bại!</span>
          <p className="text-sm mt-1">Vui lòng thử lại sau</p>
        </div>
      );
    }
  };

  if (!order) return <p className="p-4">Đang tải chi tiết...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <ToastContainer 
        position="top-right"
        toastClassName="!bg-white !text-gray-800 !shadow-xl !rounded-xl"
        progressClassName="!bg-gradient-to-r from-red-500 to-orange-500"
      />
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chi tiết đơn hàng</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        {/* Thông tin đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Mã đơn:</strong> {order._id}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Người mua:</strong> {order.userId?.name}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Trạng thái:</strong>{" "}
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                order.status === "Cancelled" 
                  ? "bg-red-100 text-red-800" 
                  : order.status === "Processing" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-green-100 text-green-800"
              }`}>
                {order.status}
              </span>
            </p>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="border-t pt-4">
          <p className="text-xl font-bold text-gray-800">
            Tổng tiền:{" "}
            <span className="text-blue-600">
              {order.totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </p>
        </div>

        {/* Danh sách sản phẩm */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Sản phẩm</h2>
        <ul className="space-y-4">
          {order.items.map((item, i) => (
            <li 
              key={i} 
              className="flex gap-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={item.productId?.image}
                className="w-24 h-24 object-cover rounded-xl border"
                alt={item.productId?.name}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-lg">{item.productId?.name}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-gray-600">
                  <p>Số lượng: <span className="font-medium">{item.quantity}</span></p>
                  <p>Đơn giá: <span className="font-medium">
                    {item.price?.toLocaleString("vi-VN")}đ
                  </span></p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Nút và Modal hủy đơn */}
        {order.status !== "Cancelled" && (
          <div className="border-t pt-6 mt-6 flex justify-end">
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg 
                transition-all duration-200 hover:scale-105 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy đơn hàng
            </button>
          </div>
        )}
      </div>

      {/* Modal xác nhận hủy */}
      <Modal
        isOpen={isCancelModalOpen}
        onRequestClose={() => setIsCancelModalOpen(false)}
        style={customStyles}
        contentLabel="Xác nhận hủy đơn"
      >
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận hủy đơn</h3>
          <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác.</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Quay lại
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xác nhận hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;