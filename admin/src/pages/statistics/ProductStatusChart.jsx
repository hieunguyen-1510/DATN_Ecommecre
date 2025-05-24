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

const ProductStatusChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Đã bán', 'Chưa bán'],
    datasets: [{
      data: [22, 9],
      backgroundColor: ['#4caf50', '#ff9800'],
      borderWidth: 1,
    }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reports?type=product_status`);
        const labels = res.data.map(item => item.type === 'sold' ? 'Đã bán' : 'Chưa bán');
        const values = res.data.map(item => item.value);
        
        setChartData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4caf50', '#ff9800'],
            borderWidth: 1,
          }]
        });
      } catch (err) {
        console.error('Lỗi gọi API product Stats:', err);
        setError('Không thể tải dữ liệu thống kê sản phẩm');
        // Sử dụng dữ liệu mặc định khi API fail
        setChartData({
          labels: ['Đã bán', 'Chưa bán'],
          datasets: [{
            data: [22, 9],
            backgroundColor: ['#4caf50', '#ff9800'],
            borderWidth: 1,
          }],
        });
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
      <h3 className="text-lg font-semibold mb-4 text-center">TRẠNG THÁI SẢN PHẨM</h3>
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

export default ProductStatusChart;