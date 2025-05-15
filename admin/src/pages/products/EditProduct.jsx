import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, notification, InputNumber } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../../App";

const { Option } = Select;

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          notification.error({ message: response.data.message });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải sản phẩm",
          description: error.response?.data?.message || "Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProduct();
  }, [id, token]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.put(`${backendUrl}/api/product/update/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        notification.success({ message: "Cập nhật sản phẩm thành công!" });
        navigate("/products");
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi cập nhật", description: error.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa sản phẩm</h1>
      <Form layout="vertical" initialValues={product} onFinish={onFinish}>
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}>
          <Input type="number" addonAfter={currency} />
        </Form.Item>
        <Form.Item label="Tồn kho" name="stock" rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho!" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select>
            <Option value="active">Đang bán</Option>
            <Option value="out_of_stock">Hết hàng</Option>
            <Option value="hidden">Ẩn</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Kích thước" name="sizes">
          <Select mode="multiple" allowClear placeholder="Chọn các kích thước">
            <Option value="S">S</Option>
            <Option value="M">M</Option>
            <Option value="L">L</Option>
            <Option value="XL">XL</Option>
            <Option value="XXL">XXL</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
          <Button className="ml-3" onClick={() => navigate("/products")}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
