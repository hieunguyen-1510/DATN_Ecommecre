import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Typography, Spin, Input, Button } from "antd";
import axios from "axios";
import { CSVLink } from "react-csv";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const { Title } = Typography;
const { Search } = Input;

const rankColors = {
  "Kim cương": "cyan",
  "Bạch kim": "geekblue",
  Vàng: "gold",
  Bạc: "purple",
  "Chưa mua hàng": "default",
};

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (value) => {
    const filtered = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(value.toLowerCase()) ||
        c.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Tổng chi tiêu (VND)",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (amount) => amount.toLocaleString("vi-VN"),
      sorter: (a, b) => a.totalSpent - b.totalSpent,
    },
    {
      title: "Hạng thành viên",
      dataIndex: "rank",
      key: "rank",
      render: (rank) => <Tag color={rankColors[rank]}>{rank}</Tag>,
      filters: Object.keys(rankColors).map((r) => ({ text: r, value: r })),
      onFilter: (value, record) => record.rank === value,
    },
  ];

  return (
    <div className="p-4">
      <Card className="shadow-md rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <Title level={3} className="!mb-0">
            Quản lý khách hàng
          </Title>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <CSVLink
              data={customers}
              filename={"danh-sach-khach-hang.csv"}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-center"
            >
              Xuất CSV
            </CSVLink>
            <Search
              placeholder="Tìm theo tên hoặc email"
              onSearch={handleSearch}
              enterButton="Tìm"
              allowClear
              className="w-full sm:w-80"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredCustomers}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        )}
      </Card>
    </div>
  );
};

export default CustomerList;
