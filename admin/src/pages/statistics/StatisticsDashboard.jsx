import React from 'react';
import ProductStatusChart from './ProductStatusChart';
import OrderStatsChart from './OrderStatsChart';
import OrderTimeStatsChart from './OrderTimeStatsChart';
import InventoryStatsChart from './InventoryStatsChart';
import BestSellersChart from './BestSellersChart';

const StatisticDashboard = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800">📊 THỐNG KÊ HỆ THỐNG</h2>

      {/* Phần thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Tổng sản phẩm</h3>
          <p className="text-2xl font-bold mt-2">78</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold mt-2">169</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
          <p className="text-2xl font-bold mt-2">5,250,000 VND</p>
        </div>
      </div>
      {/* Các biểu đồ khác */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductStatusChart />
        <OrderStatsChart />
      </div>

      {/* Biểu đồ thống kê theo thời gian */}
      <OrderTimeStatsChart />
       {/* Biểu đồ sản phẩm tồn kho và bán chạy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryStatsChart />
        <BestSellersChart />
      </div>
    </div>
  );
};

export default StatisticDashboard;