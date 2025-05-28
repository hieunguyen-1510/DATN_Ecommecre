import React, { useEffect, useState, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { backendUrl } from "../../App";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductStatusChart = () => {
  const [chartData, setChartData] = useState({
    labels: ["Đã bán", "Chưa bán"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#4caf50", "#ff9800"],
        borderWidth: 1,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Callback function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${backendUrl}/api/reports?type=product_status`
      );
      console.log("API response:", res.data);
      const data = res.data.data || res.data;
      // const data = res.data;

      const labels = data.map((item) => item.type);
      const values = data.map((item) => item.value);

      setChartData({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ["#4caf50", "#ff9800"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      });
    } catch (err) {
      console.error("Lỗi gọi API product Stats:", err);
      setError("Không thể tải dữ liệu thống kê sản phẩm.");

      setChartData({
        labels: ["Đã bán", "Chưa bán"],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ["#4caf50", "#ff9800"],
            borderWidth: 1,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
          },
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: "TRẠNG THÁI SẢN PHẨM",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#333",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
        TRẠNG THÁI SẢN PHẨM
      </h3>
      <div className="flex-grow flex items-center justify-center min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : chartData.datasets[0]?.data.reduce((sum, val) => sum + val, 0) >
          0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Không có dữ liệu trạng thái sản phẩm.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductStatusChart;
