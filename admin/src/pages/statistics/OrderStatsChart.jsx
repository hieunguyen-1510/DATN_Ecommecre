import React, { useEffect, useState, useCallback} from 'react';
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

  // Callback function 
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/reports/order-stats`);
      const stats = res.data.data;

      const statusMap = {
        'Cancelled': 'Đã hủy',
        'Delivered': 'Đã giao',
        'pending': 'Đang chờ',
        'Order Placed': 'Đã đặt',
        'Processing': 'Đang xử lý',
        'Shipped': 'Đang giao',
        'Refunded': 'Hoàn tiền'
      };

      const labels = stats.map(item => statusMap[item._id] || item._id);
      const values = stats.map(item => item.count);
      const backgroundColors = [
        '#4caf50', // Delivered - Green
        '#f44336', // Cancelled - Red
        '#2196f3', // Processing - Blue
        '#ff9800', // Pending - Orange
        '#9c27b0', // Order Placed - Purple
        '#607d8b', // Shipped - Grey
        '#ffeb3b'  // Refunded - Yellow
      ];

      setChartData({
        labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1,
          hoverOffset: 4 
        }]
      });
    } catch (err) {
      console.error('Lỗi gọi API Order Stats:', err);
      setError('Không thể tải dữ liệu thống kê đơn hàng');
      // Fallback to default data or clear data on error
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  }, []); 

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Chart options for legend, tooltips, and aspect ratio
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', 
        labels: {
          font: {
            size: 14
          },
          boxWidth: 20, 
          padding: 15, 
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'TRẠNG THÁI ĐƠN HÀNG',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333',
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">TRẠNG THÁI ĐƠN HÀNG</h3>
      <div className="flex-grow flex items-center justify-center min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : chartData.labels.length > 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">Không có dữ liệu trạng thái đơn hàng.</p>
        )}
      </div>
    </div>
  );
};

export default OrderStatsChart;