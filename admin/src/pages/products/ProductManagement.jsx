import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Tooltip,
  Typography,
  Tag,
  Image,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../../App";
import { toast } from "react-toastify";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
import dayjs from "dayjs";

const ProductManagement = ({ token }) => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, pageSize, search },
      });

      if (response.data.success) {
        setList(response.data.products);
        setPagination({
          current: page,
          pageSize,
          total: response.data.total,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Error loading products.");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await axios.delete(
            `${backendUrl}/api/product/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            fetchList(pagination.current, pagination.pageSize, searchText);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error.response?.data || error.message);
          toast.error("Đã xảy ra lỗi khi xóa sản phẩm.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công!");
        setList(
          list.map((item) => (item._id === id ? { ...item, status } : item))
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Cập nhật trạng thái thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchList(1, pagination.pageSize, value);
  };

  const showProductDetail = (record) => {
    setSelectedProduct(record);
    setIsDetailModalVisible(true);
  };

  useEffect(() => {
    if (!token) return;
    fetchList();
  }, [token]);

  const columns = [
    {
      title: "Ngày nhập",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => (
        <Text style={{ whiteSpace: "nowrap" }}>
          {dayjs(createdAt).format("DD/MM/YYYY")}
        </Text>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (images) => (
        <Image
          src={images?.[0] || ""}
          alt="product"
          width={70}
          height={70}
          style={{
            objectFit: "cover",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
          fallback="https://via.placeholder.com/70"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => ( // <--- SỬA: Bỏ record khỏi render vì không dùng trong Button onClick nữa
        <Tooltip title={text}>
          <Button
            type="link"
            // <--- ĐÃ BỎ: onClick={() => navigate(`/product-detail/${record._id}`)}
            style={{
              padding: 0,
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {text}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Giá mua",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      align: "right",
      render: (price) => (
        <Text style={{ whiteSpace: "nowrap" }}>{`${price?.toLocaleString()} ${currency}`}</Text>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "finalPrice",
      key: "finalPrice",
      align: "right",
      render: (price) => (
        <Text strong style={{ color: "#52c41a", whiteSpace: "nowrap" }}>
          {`${price?.toLocaleString()} ${currency}`}
        </Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      render: (stock) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock > 0 ? stock : "Hết hàng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "hidden"
              ? "gray"
              : "orange"
          }
        >
          {status === "active" ? "Đang bán" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => showProductDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/edit-product/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeProduct(record._id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">
          🛍️ Quản lý sản phẩm
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/add-product")}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Input.Search
        placeholder="Tìm kiếm sản phẩm..."
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onSearch={handleSearch}
      />

      <Table
        columns={columns}
        dataSource={list}
        rowKey="_id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={(newPagination) =>
          fetchList(newPagination.current, newPagination.pageSize)
        }
        loading={loading}
        bordered
        className="mt-4"
      />
      <Modal
        title={
          <span className="text-xl font-semibold">📦 Chi tiết sản phẩm</span>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Tên sản phẩm:</Text>
                <p className="text-gray-800">{selectedProduct.name}</p>
              </div>
              <div>
                <Text strong>Danh mục:</Text>
                <p className="text-gray-800">{selectedProduct.category}</p>
              </div>
              <div>
                <Text strong>Giá mua:</Text>
                <p className="text-gray-600 font-medium">
                  {selectedProduct.purchasePrice?.toLocaleString()} {currency}
                </p>
              </div>
              <div>
                <Text strong>Giá bán:</Text>
                {selectedProduct.discountPercentage ||
                selectedProduct.discountAmount ? (
                  <div>
                    <Text delete className="text-gray-500">
                      {selectedProduct.price?.toLocaleString()} {currency}
                    </Text>
                    <br />
                    <Text strong className="text-green-600">
                      {selectedProduct.finalPrice?.toLocaleString()} {currency}
                    </Text>
                    <br />
                    <Text type="secondary">
                      {selectedProduct.discountPercentage
                        ? `Giảm ${selectedProduct.discountPercentage}%`
                        : `Giảm ${selectedProduct.discountAmount?.toLocaleString()} ${currency}`}
                    </Text>
                  </div>
                ) : (
                  <p className="text-green-600 font-medium">
                    {selectedProduct.price?.toLocaleString()} {currency}
                  </p>
                )}
              </div>
              <div>
                <Text strong>Tồn kho:</Text>
                <Tag color={selectedProduct.stock > 0 ? "green" : "red"}>
                  {selectedProduct.stock}
                </Tag>
              </div>
            </div>

            <div>
              <Text strong>Mô tả:</Text>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedProduct.description || "Không có mô tả"}
              </p>
            </div>

            <div>
              <Text strong>Hình ảnh:</Text>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {selectedProduct.image?.length > 0 ? (
                  selectedProduct.image.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      width={150}
                      height={150}
                      className="rounded-lg object-cover"
                      preview={{
                        mask: <EyeOutlined className="text-white text-xl" />,
                      }}
                    />
                  ))
                ) : (
                  <Text type="secondary">Không có hình ảnh</Text>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagement;