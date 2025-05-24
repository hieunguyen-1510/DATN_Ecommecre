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
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Doanh thu (VND)',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  });
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        period,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      };
      
      const res = await axios.get(`${backendUrl}/api/reports/time-stats`, { params });
      const data = res.data.data;
      
      setChartData({
        labels: data.map(item => item.date),
        datasets: [
          {
            ...chartData.datasets[0],
            data: data.map(item => item.totalOrders),
          },
          {
            ...chartData.datasets[1],
            data: data.map(item => item.totalRevenue),
          }
        ],
      });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, startDate, endDate]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label.includes('Doanh thu')) {
              label += new Intl.NumberFormat('vi-VN').format(context.raw) + ' VND';
            } else {
              label += context.raw;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Số đơn hàng'
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Doanh thu (VND)'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN').format(value);
          }
        }
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">THỐNG KÊ ĐƠN HÀNG THEO THỜI GIAN</h3>
        <div className="flex items-center space-x-4">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded px-3 py-1"
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
              className="border rounded px-3 py-1 w-32"
            />
            <span>đến</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              className="border rounded px-3 py-1 w-32"
            />
          </div>
          
          <button 
            onClick={fetchData}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Lọc
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="h-96">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default OrderTimeStatsChart;