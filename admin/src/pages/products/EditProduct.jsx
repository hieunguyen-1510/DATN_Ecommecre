import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  InputNumber,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl, currency } from "../../App";

const { Option } = Select;

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const fetchedProduct = response.data.product;

          // --- MODIFIED CODE START ---
          let parsedSizes = [];
          if (fetchedProduct.sizes) {
            try {
              parsedSizes =
                typeof fetchedProduct.sizes === "string"
                  ? JSON.parse(fetchedProduct.sizes)
                  : fetchedProduct.sizes;

              // Ensure parsedSizes is an array, even if JSON.parse returns something else or is null/undefined
              if (!Array.isArray(parsedSizes)) {
                parsedSizes = [];
              }
            } catch (error) {
              console.error("Error parsing product sizes:", error);
              parsedSizes = []; // Fallback to empty array if parsing fails
            }
          }
          // --- MODIFIED CODE END ---

          setProduct(fetchedProduct);
          form.setFieldsValue({
            ...fetchedProduct,
            // Use the parsedSizes here
            sizes: parsedSizes, // <--- IMPORTANT CHANGE
            images:
              fetchedProduct.image?.map((url, index) => ({
                uid: url,
                name: `image-${index + 1}.jpg`,
                status: "done",
                url: url,
              })) || [],
          });
        } else {
          notification.error({ message: response.data.message });
          navigate("/products");
        }
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải sản phẩm",
          description: error.response?.data?.message || "Vui lòng thử lại sau.",
        });
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchProduct();
    }
  }, [id, token, form, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "images") {
          if (value && Array.isArray(value)) {
            value.forEach((file, index) => {
              if (file.originFileObj) {
                formData.append(`image${index + 1}`, file.originFileObj);
              }
            });
          }
        } else if (key === "sizes") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "bestseller") {
          formData.append(key, String(value));
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        notification.success({ message: "Cập nhật sản phẩm thành công!" });
        navigate("/products");
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      notification.error({
        message: "Lỗi khi cập nhật",
        description: error.response?.data?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa sản phẩm</h1>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select>
            <Select.Option value="Men">Nam</Select.Option>
            <Select.Option value="Women">Nữ</Select.Option>
            <Select.Option value="Kids">Trẻ em</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="subCategory"
          label="Danh mục con"
          rules={[{ required: true, message: "Vui lòng chọn danh mục con!" }]}
        >
          <Select>
            <Select.Option value="Street Tops">Áo đường phố</Select.Option>
            <Select.Option value="Sweater">Áo Sweater</Select.Option>
            <Select.Option value="Long sleeve shirt">
              Áo sơ mi dài tay
            </Select.Option>
            <Select.Option value="Hoodies">Hoodies</Select.Option>
            <Select.Option value="Outerwear">Áo khoác</Select.Option>
            <Select.Option value="Street Bottoms">Quần đường phố</Select.Option>
            <Select.Option value="Shorts">Quần short</Select.Option>
            <Select.Option value="Jeans">Quần jeans</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="purchasePrice" label="Giá mua sản phẩm">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `${value} ${currency}`}
            parser={(value) => value.replace(` ${currency}`, "")}
          />
        </Form.Item>
        <Form.Item
          label="Giá bán"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
        >
          <Input type="number" addonAfter={currency} />
        </Form.Item>
        <Form.Item
          label="Tồn kho"
          name="stock"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
          ]}
        >
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
        <Form.Item
          label="Ảnh sản phẩm"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            return e && e.fileList;
          }}
        >
          <Upload
            listType="picture"
            multiple
            maxCount={4}
            beforeUpload={() => false}
          >
            <Button>Chọn ảnh</Button>
          </Upload>
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
