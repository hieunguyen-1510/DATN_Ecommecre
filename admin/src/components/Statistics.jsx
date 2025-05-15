import React from 'react';
// import Header from './Header'; 
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';

const Statistics = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📊 Thống kê hệ thống</h1>
      {/* <Header /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Người dùng */}
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600 text-xl">
              <UserOutlined />
            </div>
            <div>
              <p className="text-gray-500">Người dùng</p>
              <p className="text-2xl font-bold text-gray-800">3,782</p>
            </div>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600 text-xl">
              <ShoppingCartOutlined />
            </div>
            <div>
              <p className="text-gray-500">Đơn hàng</p>
              <p className="text-2xl font-bold text-gray-800">5,359</p>
            </div>
          </div>
        </div>

        {/* Doanh thu */}
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600 text-xl">
              <DollarCircleOutlined />
            </div>
            <div>
              <p className="text-gray-500">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-800">120 triệu ₫</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
