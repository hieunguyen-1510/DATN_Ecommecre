import React, { useState, useEffect, useCallback } from "react";
import { Table, InputNumber, Select, message, Input, Spin } from "antd";
import { debounce } from "lodash";
import axios from "axios";
import { backendUrl } from "../../App";

const { Search } = Input;
const { Option } = Select;

const Inventory = () => {
  const [state, setState] = useState({
    products: [],
    loading: false,
    updatingId: null,
    pagination: { current: 1, pageSize: 10, total: 0 },
    search: "",
  });

  const token = localStorage.getItem("token");

  // Hàm fetch products với debounce
  const fetchProducts = useCallback(
    debounce(async (params) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: params.pagination.current,
            pageSize: params.pagination.pageSize,
            search: params.search,
          },
        });

        if (response.data.success) {
          setState((prev) => ({
            ...prev,
            products: response.data.products,
            pagination: {
              ...prev.pagination,
              total: response.data.total,
            },
          }));
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi tải dữ liệu");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchProducts({
      pagination: state.pagination,
      search: state.search,
    });
  }, [state.pagination.current, state.pagination.pageSize, state.search, fetchProducts]);

  const handleUpdate = async (id, field, value) => {
    setState((prev) => ({ ...prev, updatingId: id }));
    try {
      const endpoint = field === "stock" ? "stock" : "status";
      await axios.put(
        `${backendUrl}/api/products/${endpoint}/${id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      message.success(`Cập nhật ${field === "stock" ? "tồn kho" : "trạng thái"} thành công`);
      fetchProducts({
        pagination: state.pagination,
        search: state.search,
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setState((prev) => ({ ...prev, updatingId: null }));
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (images) => (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
          <img
            src={images?.[0] || "/placeholder-product.png"}
            alt="product"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 200,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Nam", value: "Men" },
        { text: "Nữ", value: "Women" },
        { text: "Trẻ em", value: "Kids" },
      ],
      onFilter: (value, record) => record.category === value,
      render: (text) => <span className="capitalize">{text}</span>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text, record) => (
        <Spin spinning={state.updatingId === record._id}>
          <InputNumber
            min={0}
            max={9999}
            value={text}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\D/g, "")}
            onChange={(value) => handleUpdate(record._id, "stock", value)}
            className="w-28 inventory-input"
            disabled={state.updatingId === record._id}
          />
        </Spin>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Spin spinning={state.updatingId === record._id}>
          <Select
            value={text}
            onChange={(value) => handleUpdate(record._id, "status", value)}
            className="w-36 inventory-status"
            disabled={state.updatingId === record._id}
          >
            <Option value="active">🟢 Đang bán</Option>
            <Option value="out_of_stock">🔴 Hết hàng</Option>
            <Option value="hidden">⚫️ Ẩn</Option>
          </Select>
        </Spin>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Quản Lý Tồn Kho</h1>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton
            onSearch={(value) => {
              setState((prev) => ({
                ...prev,
                search: value,
                pagination: { ...prev.pagination, current: 1 },
              }));
            }}
            className="w-96"
          />
        </div>

        <Table
          columns={columns}
          dataSource={state.products}
          loading={state.loading}
          rowKey="_id"
          pagination={{
            ...state.pagination,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onChange={(pagination) => {
            setState((prev) => ({
              ...prev,
              pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize,
              },
            }));
          }}
          scroll={{ x: 1200 }}
          rowClassName="hover:bg-blue-50 transition-colors"
        />
      </div>
    </div>
  );
};

export default Inventory;