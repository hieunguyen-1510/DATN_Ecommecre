import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { backendUrl } from '../../App';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reports/order-stats`);
        const stats = res.data.data;
        
        const labels = stats.map(item => {
          // Chuyển đổi label sang tiếng Việt nếu cần
          const statusMap = {
            'Cancelled': 'Đã hủy',
            'Delivered': 'Đã giao',
            'pending': 'Đang chờ',
            'Order Placed': 'Đã đặt',
            'Processing': 'Đang xử lý',
            'Shipped': 'Đang giao',
            'Refunded': 'Hoàn tiền'
          };
          return statusMap[item._id] || item._id;
        });
        
        const values = stats.map(item => item.count);
        const backgroundColors = [
          '#4caf50', // Đã giao - xanh lá
          '#f44336', // Đã hủy - đỏ
          '#2196f3', // Đang xử lý - xanh dương
          '#ff9800', // Đang chờ - cam
          '#9c27b0', // Đã đặt - tím
          '#607d8b', // Đang giao - xám
          '#ffeb3b'  // Hoàn tiền - vàng
        ];

        setChartData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderWidth: 1,
          }]
        });
      } catch (err) {
        console.error('Lỗi gọi API Order Stats:', err);
        setError('Không thể tải dữ liệu thống kê đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4 text-center">TRẠNG THÁI ĐƠN HÀNG</h3>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="h-64">
          <Doughnut data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default OrderStatsChart;