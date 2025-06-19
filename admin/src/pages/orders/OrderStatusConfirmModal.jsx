import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaTimes } from 'react-icons/fa';

const OrderStatusConfirmModal = ({ isOpen, onClose, onConfirm, orderId, newStatus, currentCancelReason }) => {
  const [cancelReasonInput, setCancelReasonInput] = useState(''); 
  const isCancelledStatus = newStatus === 'Cancelled'; 

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, duration: 0.4, type: "spring", damping: 25, stiffness: 500 } },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } }
  };

  const handleConfirmAction = () => {
    // Nếu là trạng thái hủy, gửi lý do hủy 
    if (isCancelledStatus) {
      onConfirm(orderId, newStatus, cancelReasonInput);
    } else {
      onConfirm(orderId, newStatus);
    }
    setCancelReasonInput(''); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative transform scale-100" 
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Đóng"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Xác nhận thay đổi trạng thái</h3>
            
            {/* Modal Body */}
            <p className="text-gray-700 text-center mb-4 leading-relaxed">
              Bạn có chắc chắn muốn cập nhật đơn hàng <span className="font-semibold text-orange-600">{orderId?.substring(0, 8).toUpperCase()}</span> thành {" "}
              <span className={`font-bold ${isCancelledStatus ? 'text-red-600' : 'text-blue-600'}`}>
                "{newStatus}"
              </span> không?
            </p>

            {/* Input lý do hủy  */}
            {isCancelledStatus && (
              <div className="mb-6">
                <label htmlFor="cancel-reason-admin" className="block text-gray-700 text-sm font-semibold mb-2"> 
                  Lý do hủy (không bắt buộc):
                </label>
                <textarea
                  id="cancel-reason-admin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-y min-h-[80px] bg-white text-gray-900 placeholder-gray-500" // <-- Đã thêm bg-white và text-gray-900, placeholder-gray-500
                  placeholder="Nhập lý do hủy đơn hàng..."
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                ></textarea>
              </div>
            )}

            {/* Hiển thị lý do hủy hiện có nếu đơn hàng đã bị hủy trước đó */}
            {newStatus !== 'Cancelled' && currentCancelReason && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
                <p className="font-bold mb-1">Lý do hủy hiện tại:</p>
                <p className="italic text-sm">{currentCancelReason}</p>
              </div>
            )}


            <p className="text-gray-600 text-center text-sm mb-6">
              Thao tác này <span className="font-bold text-red-600">có thể không hoàn tác</span>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-6 py-3 text-white font-bold rounded-full transition-colors duration-300 shadow-md hover:shadow-lg 
                  ${isCancelledStatus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderStatusConfirmModal;
