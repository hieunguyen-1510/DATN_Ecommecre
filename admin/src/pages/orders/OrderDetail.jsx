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
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '24px' 
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000 
  }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false); 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/orders/detail/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order detail:", err);
        toast.error("Không thể tải chi tiết đơn hàng");
      }
    };
    fetchOrder();
  }, [orderId, token, backendUrl]); 

  const handleCancel = async () => {
    setLoadingAction(true); // Bắt đầu loading
    try {
      // Endpoint này là admin update status, không phải user cancel
      const res = await axios.post(
        `${backendUrl}/api/orders/status`,
        { orderId, status: "Cancelled" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
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
        setIsCancelModalOpen(false); // Đóng modal
      } else {
        toast.error(
          <div>
            <span className="font-medium">❌ Hủy đơn thất bại!</span>
            <p className="text-sm mt-1">{res.data.message || "Vui lòng thử lại sau"}</p>
          </div>
        );
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error(
        <div>
          <span className="font-medium">❌ Hủy đơn thất bại!</span>
          <p className="text-sm mt-1">Lỗi server hoặc không có quyền.</p>
        </div>
      );
    } finally {
      setLoadingAction(false); // Kết thúc loading
    }
  };

  if (!order) return <p className="p-4 text-center text-gray-600">Đang tải chi tiết...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 rounded-lg shadow-lg"> 
      <ToastContainer 
        position="top-right"
        toastClassName="!bg-white !text-gray-800 !shadow-xl !rounded-xl"
        progressClassName="!bg-gradient-to-r from-red-500 to-orange-500"
      />
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Chi tiết đơn hàng</h1> 

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6"> 
        {/* Thông tin đơn hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Mã đơn:</strong> <span className="font-mono text-sm">{order._id}</span> 
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Người mua:</strong> {order.userId?.name || 'N/A'}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Email:</strong> {order.userId?.email || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong className="text-gray-800">Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Trạng thái:</strong>{" "}
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === "Cancelled" 
                  ? "bg-red-100 text-red-800" 
                  : order.status === "Processing" 
                    ? "bg-blue-100 text-blue-800" 
                    : order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800" 
              }`}>
                {order.status === "Order Placed" ? "Đang chờ xử lý" : order.status}
              </span>
            </p>
          </div>
        </div>

        {/* Lý do hủy đơn hàng - THÊM PHẦN NÀY */}
        {order.status === "Cancelled" && order.cancelReason && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <p className="font-bold mb-2">Lý do hủy:</p>
            <p className="italic">{order.cancelReason}</p>
          </div>
        )}

        {/* Tổng tiền */}
        <div className="border-t pt-4">
          <p className="text-xl font-bold text-gray-800">
            Tổng tiền:{" "}
            <span className="text-orange-600"> {/* Đổi màu tổng tiền sang cam */}
              {order.totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </p>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Địa chỉ giao hàng</h2>
          <p className="text-gray-700">{order.address}</p>
        </div>

        {/* Danh sách sản phẩm */}
        <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">Sản phẩm</h2>
        <ul className="space-y-4">
          {order.items.map((item, i) => (
            <li 
              key={i} 
              className="flex gap-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors" // Thêm shadow-sm
            >
              <img
                src={item.productId?.image?.[0] || 'https://placehold.co/80x80/E0E0E0/6C6C6C?text=No+Image'} 
                className="w-20 h-20 object-cover rounded-xl border border-gray-200" // Kích thước vuông
                alt={item.productId?.name || 'Sản phẩm'}
                onError={(e) => { e.target.src = 'https://placehold.co/80x80/E0E0E0/6C6C6C?text=No+Image'; }}
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-lg">{item.productId?.name || 'Sản phẩm đã bị xóa'}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-gray-600 text-sm"> {/* text-sm cho chi tiết */}
                  <p>Số lượng: <span className="font-medium">{item.quantity}</span></p>
                  <p>Kích thước: <span className="font-medium">{item.size || 'N/A'}</span></p>
                  <p className="col-span-2">Đơn giá: <span className="font-bold text-orange-500"> {/* Màu cam cho đơn giá */}
                    {item.price?.toLocaleString("vi-VN")}đ
                  </span></p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Phương thức thanh toán */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Phương thức thanh toán</h2>
          <p className="text-gray-700 font-semibold">{order.paymentMethod}</p>
        </div>


        {/* Nút và Modal hủy đơn (Admin có thể hủy) */}
        {order.status !== "Cancelled" && order.status !== "Delivered" && ( 
          <div className="border-t pt-6 mt-6 flex justify-end">
            <button
              onClick={() => setIsCancelModalOpen(true)}
              disabled={loadingAction} // Vô hiệu hóa nút khi đang loading
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg 
                transition-all duration-200 hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAction ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang hủy...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hủy đơn hàng
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal xác nhận hủy của Admin */}
      <Modal
        isOpen={isCancelModalOpen}
        onRequestClose={() => setIsCancelModalOpen(false)}
        style={customStyles}
        contentLabel="Xác nhận hủy đơn"
      >
        <div className="p-4 text-center"> {/* Căn giữa nội dung modal */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận hủy đơn</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này không thể hoàn tác.</p>
          
          <div className="flex justify-center space-x-3 mt-4"> {/* Căn giữa các nút */}
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={handleCancel}
              disabled={loadingAction} // Vô hiệu hóa nút khi đang loading
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAction ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;
