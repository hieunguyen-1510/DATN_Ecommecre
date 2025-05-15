import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTruck,
  FaShieldAlt,
  FaShoppingCart,
  FaExchangeAlt,
  FaQuestionCircle,
  FaMapMarkerAlt
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Services */}
          <div className="space-y-4">
            <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaTruck className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Miễn phí vận chuyển</p>
                <p className="text-sm text-gray-600">Cho đơn từ 500K</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <FaShieldAlt className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Bảo hành 1:1</p>
                <p className="text-sm text-gray-600">Trong 7 ngày</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-transform">
                  <FaShoppingCart className="text-blue-600 text-sm" />
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-transform">
                  <FaExchangeAlt className="text-blue-600 text-sm" />
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-transform">
                  <FaQuestionCircle className="text-blue-600 text-sm" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 mb-3">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <FaPhone className="text-blue-600" />
                </div>
                <span className="text-gray-600">0348 134 940</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <FaEnvelope className="text-blue-600" />
                </div>
                <span className="text-gray-600">support@streetstyle.vn</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <FaClock className="text-blue-600" />
                </div>
                <span className="text-gray-600">9h - 17h30 (Nghỉ CN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 STREET STYLE - Giấy chứng nhận ĐKKD số 0989908100
          </p>
          <p className="mt-2 text-xs text-gray-400">
            41 Đường số 1,KP.1, Hiệp Bình Chánh, Thủ Đức, TP.HCM
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;