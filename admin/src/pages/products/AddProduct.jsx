import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Checkbox,
  InputNumber,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { backendUrl, currency } from "../../App";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const AddProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchProduct(id);
    }
  }, [id]);

  // Fetch sản phẩm nếu đang chỉnh sửa
  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const product = response.data.product;
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          category: product.category,
          subCategory: product.subCategory,
          price: product.price,
          purchasePrice: product.purchasePrice,
          stock: product.stock,
          sizes: product.sizes,
          status: product.status,
          bestseller: product.bestseller,
        });

        setFileList(
          product.image.map((img, index) => ({
            uid: index,
            name: `image-${index}`,
            status: "done",
            url: img,
          }))
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin sản phẩm.");
    }
  };

  // Xử lý khi gửi form
  const onFinish = async (values) => {
    if (fileList.length === 0 && !isEditMode) {
      toast.warning("Vui lòng upload ít nhất 1 hình ảnh!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

     
      Object.keys(values).forEach((key) => {
        if (key === "sizes") {
          formData.append(key, JSON.stringify(values[key]));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          formData.append(`image${index + 1}`, file.originFileObj);
        }
      });

      const url = isEditMode
        ? `${backendUrl}/api/product/update/${id}`
        : `${backendUrl}/api/product/add`;
      const method = isEditMode ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(
          isEditMode
            ? "Cập nhật sản phẩm thành công!"
            : "Thêm sản phẩm thành công!"
        );
        navigate("/products");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý upload ảnh
  const handleUploadChange = ({ fileList }) => {
    setFileList(
      fileList
        .map((file) => ({
          ...file,
          originFileObj: file.originFileObj || file,
        }))
        .slice(0, 4)
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </h1>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          category: "Men",
          subCategory: "Street Tops",
          sizes: [],
          status: "active",
          bestseller: false,
          stock: 0,
          purchasePrice: 0,
        }}
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
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
        {/* "Giá mua" */}
        <Form.Item name="purchasePrice" label="Giá mua sản phẩm">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `${value} ${currency}`}
            parser={(value) => value.replace(` ${currency}`, "")}
          />
        </Form.Item>
        {/* Giá bán sản phẩm */}
        <Form.Item
          name="price"
          label="Giá bán sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `${value} ${currency}`}
            parser={(value) => value.replace(` ${currency}`, "")}
          />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Tồn kho"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Select.Option value="active">Đang bán</Select.Option>
            <Select.Option value="out_of_stock">Hết hàng</Select.Option>
            <Select.Option value="hidden">Ẩn</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="sizes" label="Kích cỡ sản phẩm">
          <Checkbox.Group options={["S", "M", "L", "XL", "XXL"]} />
        </Form.Item>
        <Form.Item
          name="bestseller"
          valuePropName="checked"
          label="Sản phẩm bán chạy"
        >
          <Checkbox />
        </Form.Item>
        <Form.Item label="Hình ảnh sản phẩm">
          <Upload
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            listType="picture"
            maxCount={4}
          >
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Button>
          <Button className="ml-2" onClick={() => navigate("/products")}>
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
