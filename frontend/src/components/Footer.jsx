import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTruck,
  FaShieldAlt,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaHome,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-8 border-t border-gray-700">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-7">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Trang chủ */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-extrabold text-base text-white flex items-center gap-2 uppercase tracking-wider">
              <FaHome className="text-blue-600 text-lg" />
              TRANG CHỦ
            </h4>
            <p className="text-sm text-gray-300">
              Street Style hân hạnh phục vụ!
            </p>
          </div>

          {/* Dịch vụ */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-base text-white uppercase tracking-wider">
              DỊCH VỤ
            </h4>
            <div className="flex items-start gap-3">
              <FaTruck className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-200">
                  Miễn phí vận chuyển
                </p>
                <p className="text-sm">Cho đơn từ 500K</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-200">Bảo hành 1:1</p>
                <p className="text-sm">Trong 7 ngày</p>
              </div>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-base text-white uppercase tracking-wider">
              HỖ TRỢ KHÁCH HÀNG
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 text-sm text-gray-300"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 text-sm text-gray-300"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 text-sm text-gray-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-base text-white uppercase tracking-wider">
              LIÊN HỆ
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <FaPhone className="text-blue-600" />
              <span className="text-gray-200">0348 134 940</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaEnvelope className="text-blue-600" />
              <span className="text-gray-200">support@streetstyle.vn</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaClock className="text-blue-600" />
              <span className="text-gray-200">9h - 17h30 (Nghỉ CN)</span>
            </div>

            {/* Mạng xã hội */}
            <div className="flex items-center gap-4 pt-3">
              <a
                href="https://www.instagram.com/"
                className="hover:text-blue-600"
              >
                <FaInstagram className="text-xl text-gray-200" />
              </a>
              <a
                href="https://www.facebook.com/"
                className="hover:text-blue-600"
              >
                <FaFacebookF className="text-xl text-gray-200" />
              </a>
              <a href="https://www.tiktok.com/" className="hover:text-blue-600">
                <FaTiktok className="text-xl text-gray-200" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-xs text-gray-400">
            © 2025 STREET STYLE – ĐKKD: 0989908100
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
