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

const OrderTimeStatsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số đơn hàng',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 8,
        yAxisID: 'y', 
      },
      {
        label: 'Doanh thu (VND)',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 8,
        yAxisID: 'y1', 
      }
    ],
  });
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Callback function to fetch data for order time statistics
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        period,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      };

      const res = await axios.get(`${backendUrl}/api/reports/time-stats`, { params });
      const data = res.data.data;

      setChartData(prevData => ({
        labels: data.map(item => item.date),
        datasets: [
          {
            ...prevData.datasets[0],
            data: data.map(item => item.totalOrders),
          },
          {
            ...prevData.datasets[1],
            data: data.map(item => item.totalRevenue),
          }
        ],
      }));
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu thống kê:', err);
      setError('Không thể tải dữ liệu thống kê theo thời gian.');
      setChartData(prevData => ({ ...prevData, labels: [], datasets: prevData.datasets.map(ds => ({ ...ds, data: [] })) }));
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  // Chart options for responsiveness, dual Y-axes, and tooltips
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
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label.includes('Doanh thu')) {
              label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.raw);
            } else {
              label += context.raw;
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: 'THỐNG KÊ ĐƠN HÀNG THEO THỜI GIAN',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#333',
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Số đơn hàng',
          font: {
            size: 14
          }
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Doanh thu (VND)',
          font: {
            size: 14
          }
        },
        grid: {
          drawOnChartArea: false, 
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN').format(value);
          }
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">THỐNG KÊ ĐƠN HÀNG THEO THỜI GIAN</h3>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>

          <div className="flex items-center space-x-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">đến</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Lọc
          </button>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : chartData.labels.length > 0 ? (
          <div className="w-full h-full">
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">Không có dữ liệu để hiển thị cho khoảng thời gian này.</p>
        )}
      </div>
    </div>
  );
};

export default OrderTimeStatsChart;