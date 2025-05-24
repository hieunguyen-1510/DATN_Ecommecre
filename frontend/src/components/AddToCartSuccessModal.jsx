import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCartSuccessModal = ({ show, onClose }) => {
  useEffect(() => {
    // set thoi gian
    let timer;
    if (show) {
      timer = setTimeout(() => {
        onClose();
      }, 2000); // Modal sẽ tự động đóng sau 2 giây
    }
    return () => clearTimeout(timer); 
  }, [show, onClose]);

  // Ngăn chặn sự kiện click lan truyền ra ngoài modal và đóng modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Đóng modal khi click ra ngoài
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full relative"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={handleModalContentClick} // Ngăn chặn đóng khi click vào nội dung modal
          >
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Đóng"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon giỏ hàng và dấu tick */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-gray-800" 
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1} // Độ dày nét vẽ cho biểu tượng giỏ hàng
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0 right-0 h-10 w-10 text-green-500" // Dấu tick
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              </div>
            </div>

            {/* Thông báo */}
            <p className="text-xl font-bold text-gray-800 text-center uppercase tracking-wide">
              Thêm vào giỏ hàng thành công !
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartSuccessModal;