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
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-8 border-t border-gray-700">
      <div className="container w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
          {/* Dịch vụ */}
          <div className="space-y-5 text-center md:text-left">
            <h4 className="font-extrabold text-base md:text-lg text-white mb-4 md:mb-6 uppercase tracking-wider">
              Dịch vụ
            </h4>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 mt-1">
                <FaTruck className="text-lg text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-200">
                  Miễn phí vận chuyển
                </p>

                <p className="text-sm text-gray-400 mt-1">Cho đơn từ 500K</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-3">
              <div className="flex-shrink-0 mt-1">
                <FaShieldAlt className="text-lg text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-200">Bảo hành 1:1</p>
                <p className="text-sm text-gray-400 mt-1">Trong 7 ngày</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-lg text-white mb-6 uppercase tracking-wider">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-200 hover:text-blue-600 transition-colors duration-300"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-200 hover:text-blue-600 transition-colors duration-300"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-200 hover:text-blue-600 transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-lg text-white mb-6 uppercase tracking-wider">
              Liên hệ
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-600 flex-shrink-0 text-xl" />
                <span className="text-gray-200">0348 134 940</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-600 flex-shrink-0 text-xl" />
                <span className="text-gray-200">support@streetstyle.vn</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600 flex-shrink-0 text-xl" />
                <span className="text-gray-200">9h - 17h30 (Nghỉ CN)</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6 mt-6 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/"
                className="text-gray-200 hover:text-blue-600 transition-colors duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.facebook.com/"
                className="text-gray-200 hover:text-blue-600 transition-colors duration-300"
              >
                <FaFacebookF className="text-2xl" />
              </a>
              <a
                href="https://www.tiktok.com/"
                className="text-gray-200 hover:text-blue-600 transition-colors duration-300"
              >
                <FaTiktok className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-200 text-xs sm:text-sm px-2">
            © 2025 STREET STYLE – Giấy chứng nhận Đăng ký kinh doanh số
            0989908100.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;