import React, { useEffect, useState } from 'react';
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

  const fetchData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Đã bán',
        data: soldData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tồn kho',
        data: stockData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng'
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">SẢN PHẨM BÁN CHẠY</h3>
        <div className="flex items-center space-x-2">
          <span>Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-3 py-1"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Tải lại
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default BestSellersChart;
