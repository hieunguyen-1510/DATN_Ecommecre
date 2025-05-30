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
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-200">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {/* Column 1: Dịch vụ */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-lg text-gray-900 mb-6 uppercase tracking-wider">
              Dịch vụ
            </h4>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <FaTruck className="text-lg text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Miễn phí vận chuyển
                </p>

                <p className="text-sm text-gray-600 mt-1">Cho đơn từ 500K</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-3">
              <div className="flex-shrink-0 mt-1">
                <FaShieldAlt className="text-lg text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Bảo hành 1:1</p>
                <p className="text-sm text-gray-600 mt-1">Trong 7 ngày</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-lg text-gray-900 mb-6 uppercase tracking-wider">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-lg text-gray-900 mb-6 uppercase tracking-wider">
              Liên hệ
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-600 flex-shrink-0 text-xl" />
                <span className="text-gray-600">0348 134 940</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-600 flex-shrink-0 text-xl" />
                <span className="text-gray-600">support@streetstyle.vn</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600 flex-shrink-0 text-xl" />
                <span className="text-gray-600">9h - 17h30 (Nghỉ CN)</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6 mt-6">
              <a
                href="https://www.instagram.com/"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.facebook.com/"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <FaFacebookF className="text-2xl" />
              </a>
              <a
                href="https://www.tiktok.com/"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <FaTiktok className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 STREET STYLE – Giấy chứng nhận Đăng ký kinh doanh số
            0989908100.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
