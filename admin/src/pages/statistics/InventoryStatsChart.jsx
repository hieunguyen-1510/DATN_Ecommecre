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

const InventoryStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
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
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1,
          }
        ],
      };

      setChartData(newChartData);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tồn kho:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê tồn kho sản phẩm',
      },
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h3>Thống kê tồn kho</h3>
      <div style={{ marginBottom: 20, display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div>
          <label>Từ ngày: </label>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </div>
        <div>
          <label>Đến ngày: </label>
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
        </div>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Không có dữ liệu để hiển thị</p>
      )}
    </div>
  );
};

export default InventoryStatsChart;
