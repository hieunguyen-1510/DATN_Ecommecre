import React, { useEffect, useState, useCallback } from 'react';
import ProductStatusChart from './ProductStatusChart';
import OrderStatsChart from './OrderStatsChart';
import OrderTimeStatsChart from './OrderTimeStatsChart';
import InventoryStatsChart from './InventoryStatsChart';
import BestSellersChart from './BestSellersChart';
import { backendUrl } from '../../App';
import axios from 'axios';
import moment from "moment";

const StatisticDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);

  // Function to fetch summary statistics
  const fetchSummaryStats = useCallback(async () => {
    setLoadingSummary(true);
    setErrorSummary(null);
    try {
      // Fetch Total Products from inventory-stats
      const productRes = await axios.get(`${backendUrl}/api/reports/inventory-stats`);
      setTotalProducts(productRes.data.data.totalProducts);

      // Fetch Total Orders from order-stats 
      const orderStatsRes = await axios.get(`${backendUrl}/api/reports/order-stats`);
      const totalOrdersCount = orderStatsRes.data.data.reduce((sum, item) => sum + item.count, 0);
      setTotalOrders(totalOrdersCount);

      const revenueRes = await axios.get(`${backendUrl}/api/reports/time-stats`, {
        params: {
          period: 'year', 
          startDate: '2000-01-01', 
          endDate: moment().format('YYYY-MM-DD') 
        }
      });
      const totalRevenueAmount = revenueRes.data.data.reduce((sum, item) => sum + item.totalRevenue, 0);
      setTotalRevenue(totalRevenueAmount);

    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tổng quan:', err);
      setErrorSummary('Không thể tải dữ liệu tổng quan.');
      setTotalProducts(0);
      setTotalOrders(0);
      setTotalRevenue(0);
    } finally {
      setLoadingSummary(false);
    }
  }, []); 

  // Fetch summary stats when component mounts
  useEffect(() => {
    fetchSummaryStats();
  }, [fetchSummaryStats]);

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 flex items-center justify-center">
        <span className="mr-3 text-blue-600">📊</span> THỐNG KÊ HỆ THỐNG
      </h2>

      {/* Phần thống kê tổng quan */}
      {loadingSummary ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-700">Đang tải dữ liệu tổng quan...</p>
        </div>
      ) : errorSummary ? (
        <div className="text-red-600 text-center text-lg p-4 bg-red-100 rounded-lg shadow-md">
          {errorSummary}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tổng sản phẩm</h3>
            <p className="text-4xl font-bold text-blue-600">{totalProducts.toLocaleString('vi-VN')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tổng đơn hàng</h3>
            <p className="text-4xl font-bold text-green-600">{totalOrders.toLocaleString('vi-VN')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tổng doanh thu</h3>
            <p className="text-4xl font-bold text-purple-600">{totalRevenue.toLocaleString('vi-VN')} VND</p>
          </div>
        </div>
      )}

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