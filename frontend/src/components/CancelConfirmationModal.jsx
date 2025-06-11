import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const CancelConfirmationModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { delay: 0.1, duration: 0.4, type: "spring", damping: 25, stiffness: 500 }
    },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } }
  };

  const handleConfirm = () => {
    onConfirm(cancelReason);
    setCancelReason('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white w-full max-w-lg mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-y-auto max-h-screen"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Xác nhận hủy đơn</h3>

            <p className="text-gray-700 text-center mb-4 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng{' '}
              <span className="font-semibold text-orange-600">{orderId?.substring(0, 8).toUpperCase()}</span> này không?
              <br />
              Thao tác này <span className="font-bold text-red-600">không thể hoàn tác</span>.
            </p>

            <div className="mb-6">
              <label htmlFor="cancel-reason" className="block text-gray-700 text-sm font-semibold mb-2">
                Lý do hủy (không bắt buộc):
              </label>
              <textarea
                id="cancel-reason"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-y min-h-[80px] text-gray-800"
                placeholder="Ví dụ: Đổi ý, đặt nhầm sản phẩm, tìm thấy sản phẩm khác..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Xác nhận hủy
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CancelConfirmationModal;
