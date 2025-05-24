import { Table, Button, Space, Input, Select, message, Form, Tag, Tooltip, Popconfirm} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
  
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { backendUrl } from "../../App";
import { jwtDecode } from "jwt-decode";
import CreateDiscountModal from "./CreateDiscountModal";
import EditDiscountModal from "./EditDiscountModal";
import DetailDiscountModal from "./DetailDiscountModal";

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = useState("percentage");
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [searchParams, setSearchParams] = useState({
    status: "",
    code: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const formatNumber = (value, suffix = "") => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) =>
        type === "percentage" ? "Phần trăm" : "Giảm tiền trực tiếp",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (value, record) =>
        record.discountType === "percentage"
          ? `${value}%`
          : formatNumber(value, "đ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          active: { color: "green", text: "Hoạt động" },
          inactive: { color: "orange", text: "Tạm dừng" },
          expired: { color: "red", text: "Hết hạn" },
        };
        return (
          <Tag color={statusMap[status]?.color || "gray"}>
            {statusMap[status]?.text || "Không xác định"}
          </Tag>
        );
      },
    },
    {
      title: "Thời hạn",
      key: "dateRange",
      render: (_, record) =>
        `${dayjs(record.startDate).format("DD/MM/YYYY")} - ${dayjs(
          record.endDate
        ).format("DD/MM/YYYY")}`,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn chắc chắn muốn xóa mã giảm giá này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentDiscount(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      return null;
    }
    return token;
  }, []);

  const fetchDiscounts = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await axios.get(`${backendUrl}/api/discounts`, {
          params: {
            page: params.page || pagination.current,
            limit: params.limit || pagination.pageSize,
            ...searchParams,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        setDiscounts(res.data?.data || []);
        setPagination({
          ...pagination,
          total: res.data?.pagination?.total || 0,
        });
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tải danh sách mã giảm giá"
        );
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken, pagination.current, pagination.pageSize, searchParams]
  );

  const handleCreateDiscount = async (values) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      if (!values.dateRange || values.dateRange.length < 2) {
        message.error("Vui lòng chọn khoảng thời gian áp dụng");
        return;
      }

      await axios.post(
        `${backendUrl}/api/discounts`,
        {
          code: values.code,
          discountType: values.discountType,
          value: values.value,
          minOrderValue: values.minOrderValue,
          usageLimit: values.usageLimit,
          startDate: dayjs(values.dateRange[0]).toISOString(),
          endDate: dayjs(values.dateRange[1]).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Tạo mã giảm giá thành công");
      setIsCreateModalVisible(false);
      form.resetFields();
      await fetchDiscounts();
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Lỗi khi tạo mã giảm giá. Vui lòng thử lại"
      );
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setIsEditModalVisible(true);
  };

  const handleUpdateDiscount = async (values) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await axios.put(
        `${backendUrl}/api/discounts/${editingDiscount._id}`,
        {
          ...values,
          startDate: dayjs(values.dateRange[0]).toISOString(),
          endDate: dayjs(values.dateRange[1]).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Cập nhật thành công");
      setIsEditModalVisible(false);
      form.resetFields();
      await fetchDiscounts();
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await axios.delete(`${backendUrl}/api/discounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Xóa mã giảm giá thành công");
      await fetchDiscounts();
    } catch (error) {
      message.error(error.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleSearch = async () => {
    await fetchDiscounts({ page: 1 });
  };

  const handleResetSearch = () => {
    setSearchParams({ status: "", code: "" });
    fetchDiscounts({ page: 1 });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchDiscounts({
      page: pagination.current,
      limit: pagination.pageSize,
    });
  };

  const handleDiscountTypeChange = (value) => {
    setDiscountType(value);
    form.setFieldsValue({ value: undefined });
  };

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Tìm theo mã"
            value={searchParams.code}
            onChange={(e) =>
              setSearchParams({ ...searchParams, code: e.target.value })
            }
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            value={searchParams.status}
            onChange={(value) =>
              setSearchParams({ ...searchParams, status: value })
            }
            style={{ width: 200 }}
            allowClear
          >
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Không hoạt động</Select.Option>
          </Select>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
          <Button icon={<SyncOutlined />} onClick={handleResetSearch}>
            Reset
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
          >
            Tạo mã giảm giá
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={discounts}
        loading={loading}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
        locale={{ emptyText: "Không có dữ liệu mã giảm giá" }}
      />

      <CreateDiscountModal
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        onFinish={handleCreateDiscount}
        form={form}
        discountType={discountType}
        handleDiscountTypeChange={handleDiscountTypeChange}
      />

      <EditDiscountModal
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onFinish={handleUpdateDiscount}
        form={form}
        discountType={discountType}
        handleDiscountTypeChange={handleDiscountTypeChange}
        editingDiscount={editingDiscount}
      />

      <DetailDiscountModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        currentDiscount={currentDiscount}
      />
    </div>
  );
};

export default DiscountManagement;