import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  InputNumber,
  Select,
  message,
  Input,
  Spin,
  Tag,
  Card,
  Statistic,
  Button,
  Modal,
  Form,
  Progress,
  DatePicker,
  Tabs,
} from "antd";
import {
  StockOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import axios from "axios";
import { backendUrl } from "../../App";
import dayjs from "dayjs";
import qs from "qs";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const InventoryManagement = () => {
  const [state, setState] = useState({
    products: [],
    loading: false,
    updatingId: null,
    pagination: { current: 1, pageSize: 10, total: 0 },
    search: "",
    statusFilter: [],
    stats: {
      totalProducts: 0,
      criticalStock: 0,
      lowStock: 0,
      overstock: 0,
    },
    isModalVisible: false,
    selectedProduct: null,
    discountForm: {
      percentage: 10,
      note: "",
      expiryDate: dayjs().add(7, "days"),
    },
  });

  const [discountCode, setDiscountCode] = useState("");
  const [activeDiscountTab, setActiveDiscountTab] = useState("manual");
  const token = localStorage.getItem("token");

  const getStockStatus = (product) => {
    if (product.stock <= 0) return "out_of_stock";
    if (product.stock < product.stockThreshold * 0.3) return "critical";
    if (product.stock < product.stockThreshold) return "low";
    if (product.stock > product.overstockThreshold) return "overstock";
    return "normal";
  };

  const fetchProducts = useCallback(
    debounce(async (params) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const { pagination, search, statusFilter } = params;
        const response = await axios.get(`${backendUrl}/api/inventory/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            search,
            status: statusFilter, // Gửi array trực tiếp
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        });

        if (response.data.success) {
          const productsWithStatus = response.data.data.map((product) => ({
            ...product,
            stockStatus: getStockStatus(product),
          }));

          setState((prev) => ({
            ...prev,
            products: productsWithStatus,
            pagination: {
              ...prev.pagination,
              total: response.data.pagination?.total || response.data.total,
            },
          }));
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || "Lỗi tải dữ liệu sản phẩm"
        );
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }, 500),
    []
  );

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/inventory/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setState((prev) => ({
          ...prev,
          stats: {
            totalProducts: response.data.data.totalProducts,
            criticalStock: response.data.data.criticalStock,
            lowStock: response.data.data.lowStock,
            overstock: response.data.data.overstock || 0,
          },
        }));
      }
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    }
  };

  useEffect(() => {
    fetchProducts({
      pagination: state.pagination,
      search: state.search,
      statusFilter: state.statusFilter,
    });
    fetchStats();
  }, [
    state.pagination.current,
    state.pagination.pageSize,
    state.search,
    state.statusFilter,
  ]);

  const handleUpdateStock = async (id, value) => {
    setState((prev) => ({ ...prev, updatingId: id }));
    try {
      const response = await axios.put(
        `${backendUrl}/api/inventory/${id}/stock`,
        { stock: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        message.success("Cập nhật tồn kho thành công");
        const updatedProducts = state.products.map((p) =>
          p._id === id
            ? {
                ...p,
                stock: value,
                stockStatus: getStockStatus({ ...p, stock: value }),
              }
            : p
        );

        setState((prev) => ({
          ...prev,
          products: updatedProducts,
        }));

        // Thêm log để debug
        console.log("Đang gọi fetchStats sau khi cập nhật stock");
        const statsResponse = await fetchStats();
        console.log("Kết quả fetchStats:", statsResponse);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật stock:", error);
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setState((prev) => ({ ...prev, updatingId: null }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!state.selectedProduct) return;

    try {
      let response;
      if (activeDiscountTab === "manual") {
        response = await axios.post(
          `${backendUrl}/api/inventory/${state.selectedProduct._id}/actions`,
          {
            action: "discount",
            parameters: {
              discountPercentage: state.discountForm.percentage,
              note: state.discountForm.note,
              expiryDate: state.discountForm.expiryDate.toISOString(),
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/inventory/${state.selectedProduct._id}/apply-discount`,
          { code: discountCode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      message.success(response.data.message || "Áp dụng giảm giá thành công");
      setState((prev) => ({
        ...prev,
        isModalVisible: false,
        discountForm: {
          percentage: 10,
          note: "",
          expiryDate: dayjs().add(7, "days"),
        },
      }));
      setDiscountCode("");
      fetchProducts({
        pagination: state.pagination,
        search: state.search,
        statusFilter: state.statusFilter,
      });
    } catch (error) {
      message.error(
        error.response?.data?.message || "Áp dụng giảm giá thất bại"
      );
    }
  };
  // Hàm áp dụng mã
  const applyDiscountCode = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/inventory/${state.selectedProduct._id}/apply-discount`,
        { code: discountCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        message.success(response.data.message);
        fetchProducts();
        setDiscountCode("");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Áp dụng mã thất bại");
    }
  };

  const showDiscountModal = (product) => {
    setState((prev) => ({
      ...prev,
      isModalVisible: true,
      selectedProduct: product,
    }));
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image?.[0] || "/placeholder-product.png"}
            alt={text}
            className="w-10 h-10 object-cover mr-2 rounded"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="capitalize">{text}</span>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 150,
      render: (text, record) => (
        <div>
          <div className="flex items-center mb-1">
            <InputNumber
              min={0}
              value={text}
              onChange={(value) => handleUpdateStock(record._id, value)}
              className="w-24 mr-2"
              disabled={state.updatingId === record._id}
            />
            <Spin spinning={state.updatingId === record._id} />
          </div>
          <Progress
            percent={Math.min(
              (text /
                (record.stockStatus === "overstock"
                  ? record.overstockThreshold
                  : record.stockThreshold)) *
                100,
              100
            )}
            status={
              record.stockStatus === "out_of_stock"
                ? "exception"
                : record.stockStatus === "critical"
                ? "exception"
                : record.stockStatus === "low"
                ? "active"
                : "normal"
            }
            showInfo={false}
            strokeColor={
              record.stockStatus === "out_of_stock"
                ? "#ff4d4f"
                : record.stockStatus === "critical"
                ? "#ff4d4f"
                : record.stockStatus === "low"
                ? "#faad14"
                : record.stockStatus === "overstock"
                ? "#1890ff"
                : "#52c41a"
            }
          />
        </div>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Trạng thái",
      dataIndex: "stockStatus",
      key: "stockStatus",
      width: 150,
      filters: [
        { text: "Bình thường", value: "normal" },
        { text: "Thiếu nghiêm trọng", value: "critical" },
        { text: "Sắp hết", value: "low" },
        { text: "Dư thừa", value: "overstock" },
        { text: "Hết hàng", value: "out_of_stock" },
      ],
      onFilter: (value, record) => record.stockStatus === value,
      render: (status) => {
        const colorMap = {
          normal: "green",
          critical: "red",
          low: "orange",
          overstock: "blue",
          out_of_stock: "volcano",
        };
        const labelMap = {
          normal: "Bình thường",
          critical: "Thiếu nghiêm trọng",
          low: "Sắp hết",
          overstock: "Dư thừa",
          out_of_stock: "Hết hàng",
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => showDiscountModal(record)}>
          Giảm giá
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <StockOutlined className="mr-2" /> Quản Lý Tồn Kho
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={state.stats.totalProducts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Sắp hết hàng"
              value={state.stats.lowStock}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Nguy cấp"
              value={state.stats.criticalStock}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Tồn kho nhiều"
              value={state.stats.overstock}
              prefix={<StockOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
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
              className="w-full md:w-96"
            />

            <div className="flex flex-wrap gap-2">
              <Select
                mode="multiple"
                placeholder="Lọc trạng thái"
                maxTagCount="responsive"
                value={state.statusFilter}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    statusFilter: value,
                    pagination: { ...prev.pagination, current: 1 },
                  }))
                }
                className="w-48"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="normal">Bình thường</Option>
                <Option value="low">Sắp hết</Option>
                <Option value="critical">Nguy cấp</Option>
                <Option value="out_of_stock">Hết hàng</Option>
                <Option value="overstock">Tồn kho nhiều</Option>
              </Select>

              <Button
                icon={<FileExcelOutlined />}
                onClick={() => message.info("Tính năng đang phát triển")}
              >
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-sm">
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
                  total: prev.pagination.total,
                },
              }));
            }}
            scroll={{ x: 1000 }}
            rowClassName={(record) =>
              record.stockStatus === "out_of_stock"
                ? "bg-red-50 hover:bg-red-100"
                : record.stockStatus === "critical"
                ? "bg-red-50 hover:bg-red-100"
                : record.stockStatus === "low"
                ? "bg-orange-50 hover:bg-orange-100"
                : record.stockStatus === "overstock"
                ? "bg-blue-50 hover:bg-blue-100"
                : "hover:bg-gray-50"
            }
          />
        </Card>
        <Modal
          title="Áp dụng giảm giá"
          open={state.isModalVisible}
          onCancel={() =>
            setState((prev) => ({ ...prev, isModalVisible: false }))
          }
          onOk={handleApplyDiscount}
        >
          <Tabs activeKey={activeDiscountTab} onChange={setActiveDiscountTab}>
            <Tabs.TabPane tab="Thủ công" key="manual">
              <Form layout="vertical">
                <Form.Item label="Phần trăm giảm">
                  <InputNumber
                    min={0}
                    max={100}
                    value={state.discountForm.percentage}
                    onChange={(val) =>
                      setState((prev) => ({
                        ...prev,
                        discountForm: { ...prev.discountForm, percentage: val },
                      }))
                    }
                  />
                </Form.Item>
                <Form.Item label="Ghi chú">
                  <TextArea
                    value={state.discountForm.note}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        discountForm: {
                          ...prev.discountForm,
                          note: e.target.value,
                        },
                      }))
                    }
                  />
                </Form.Item>
                <Form.Item label="Ngày hết hạn">
                  <DatePicker
                    value={state.discountForm.expiryDate}
                    onChange={(date) =>
                      setState((prev) => ({
                        ...prev,
                        discountForm: {
                          ...prev.discountForm,
                          expiryDate: date,
                        },
                      }))
                    }
                  />
                </Form.Item>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Mã giảm giá" key="code">
              <Form layout="vertical">
                <Form.Item label="Mã giảm giá">
                  <Search
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onSearch={applyDiscountCode}
                    enterButton="Áp dụng"
                    placeholder="Nhập mã giảm giá"
                  />
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    </div>
  );
};

export default InventoryManagement;
