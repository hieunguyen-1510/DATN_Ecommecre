import React, { useEffect, useState, useCallback} from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { backendUrl } from '../../App';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BestSellersChart = () => {
  const [labels, setLabels] = useState([]);
  const [soldData, setSoldData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Callback function to fetch data for best sellers
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/reports/best-sellers`, {
        params: { limit }
      });
      const data = res.data.data;

      setLabels(data.map(item => item.name));
      setSoldData(data.map(item => item.sold));
      setStockData(data.map(item => item.stock));
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm bán chạy:', err);
      setError('Không thể tải sản phẩm bán chạy.');
      setLabels([]);
      setSoldData([]);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]); 

  // Fetch data 
  useEffect(() => {
    fetchData();
  }, [fetchData]); 
  // Chart data structure
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Đã bán',
        data: soldData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)', 
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Tồn kho',
        data: stockData,
        backgroundColor: 'rgba(255, 99, 132, 0.7)', 
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Sản phẩm bán chạy',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng',
          font: {
            size: 14
          }
        },
        ticks: {
          precision: 0 
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">SẢN PHẨM BÁN CHẠY</h3>
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 font-medium">Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Tải lại
          </button>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : labels.length > 0 ? (
          <div className="w-full h-full">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">Không có sản phẩm bán chạy để hiển thị.</p>
        )}
      </div>
    </div>
  );
};

export default BestSellersChart;
