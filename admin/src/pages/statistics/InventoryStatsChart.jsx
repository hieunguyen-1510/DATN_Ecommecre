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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Callback function to fetch data for inventory statistics
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      };

      const res = await axios.get(`${backendUrl}/api/reports/inventory-stats`, { params });
      const data = res.data.data;

      const newChartData = {
        labels: ['Tổng sản phẩm', 'Tổng tồn kho', 'TB tồn kho'],
        datasets: [
          {
            label: 'Số lượng',
            data: [
              data.totalProducts,
              data.totalInStock,
              Math.round(data.averageStock)
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)', // Blue
              'rgba(255, 99, 132, 0.7)', // Red
              'rgba(75, 192, 192, 0.7)'  // Green
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1,
            borderRadius: 8, // Add rounded corners to bars
          }
        ],
      };

      setChartData(newChartData);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tồn kho:', err);
      setError('Không thể tải dữ liệu tồn kho.');
      setChartData(null); // Clear chart data on error
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]); // Dependencies for useCallback

  // Fetch data when component mounts or dates change
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency array includes fetchData

  // Chart options for responsiveness and title
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container
    plugins: {
      legend: {
        display: false, // Hide legend as labels are self-explanatory
      },
      title: {
        display: true,
        text: 'Thống kê tồn kho sản phẩm',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}`;
          }
        }
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
          precision: 0 // Ensure integer ticks for counts
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Thống kê tồn kho</h3>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Từ ngày:</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 rounded-md px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Đến ngày:</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 rounded-md px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
        ) : chartData ? (
          <div className="w-full h-full">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryStatsChart;
