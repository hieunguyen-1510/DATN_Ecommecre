import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
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
        if (response.data.products.length === 0) {
          toast.info("Không có sản phẩm nào trong danh sách.");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tải danh sách sản phẩm."
      );
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

  const handleTableChange = (newPagination) => {
    fetchList(newPagination.current, newPagination.pageSize, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchList(1, pagination.pageSize, value);
  };

  const showDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailModalVisible(true);
  };

  useEffect(() => {
    if (!token) return;
    fetchList();
  }, [token]);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (images) => (
        <div className="flex justify-center">
          {images?.length > 0 ? (
            <Image
              src={images[0]}
              alt="product"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <Text type="secondary">No Image</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text, record) => (
        <Button
          type="link"
          className="p-0 text-left"
          onClick={() => showDetail(record)}
        >
          <Text strong className="text-blue-600 hover:text-blue-800">
            {text}
          </Text>
        </Button>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Giá mua",
      dataIndex: "purchasePrice", 
      key: "purchasePrice",
      width: 150,
      align: "right",
      render: (purchasePrice) => (
        <Text className="text-gray-600">
          {purchasePrice ? `${purchasePrice.toLocaleString()} ${currency}` : "N/A"}
        </Text>
      ),
    },
      {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right",
      render: (price) => (
        <Text strong className="text-green-600">
          {price?.toLocaleString()} {currency}
        </Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 120,
      align: "center",
      render: (stock) => <Tag color={stock > 0 ? "green" : "red"}>{stock}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
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
          {status === "active"
            ? "Đang bán"
            : status === "hidden"
            ? "Ẩn"
            : "Hết hàng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
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
        <Title level={3} className="!mb-0 text-gray-800">
          🛍️ Quản lý sản phẩm
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/add-product")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-6">
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm..."
          allowClear
          enterButton={
            <Button type="primary" className="bg-gray-800 hover:bg-gray-700">
              Tìm kiếm
            </Button>
          }
          size="large"
          onSearch={handleSearch}
        />
      </div>

      <Table
        columns={columns}
        dataSource={list}
        rowKey="_id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={handleTableChange}
        loading={loading}
        bordered
        scroll={{ x: 1200 }}
        rowClassName="hover:bg-gray-50 transition-colors"
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
                <Text strong>Giá mua:</Text> {/* Thêm vào chi tiết sản phẩm */}
                <p className="text-gray-600 font-medium">
                  {selectedProduct.purchasePrice?.toLocaleString()} {currency}
                </p>
              </div>
              <div>
                <Text strong>Giá bán:</Text>
                <p className="text-green-600 font-medium">
                  {selectedProduct.price?.toLocaleString()} {currency}
                </p>
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