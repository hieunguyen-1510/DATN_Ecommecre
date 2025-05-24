import { Modal, Form, Input, Select, InputNumber, DatePicker } from "antd";
import React from "react";
import dayjs from "dayjs";
const { Option } = Select;

const EditDiscountModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  discountType,
  handleDiscountTypeChange,
  editingDiscount,
}) => {
  React.useEffect(() => {
    if (editingDiscount) {
      form.setFieldsValue({
        code: editingDiscount.code,
        discountType: editingDiscount.discountType,
        value: editingDiscount.value,
        minOrderValue: editingDiscount.minOrderValue,
        usageLimit: editingDiscount.usageLimit,
        dateRange: [
          dayjs(editingDiscount.startDate),
          dayjs(editingDiscount.endDate),
        ],
      });
    }
  }, [editingDiscount, form]);

  return (
    <Modal
      title="Chỉnh sửa mã giảm giá"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="code"
          label="Mã giảm giá"
          rules={[
            { required: true, message: "Vui lòng nhập mã giảm giá" },
            {
              pattern: /^[A-Z0-9]+$/,
              message: "Mã chỉ được chứa chữ hoa và số",
            },
          ]}
        >
          <Input placeholder="VD: SALE20" maxLength={20} />
        </Form.Item>

        <Form.Item name="discountType" label="Loại giảm giá">
          <Select onChange={handleDiscountTypeChange}>
            <Option value="percentage">Phần trăm</Option>
            <Option value="fixed_amount">Giảm tiền trực tiếp</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="value"
          label="Giá trị"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá trị giảm giá",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={discountType === "percentage" ? 100 : undefined}
            formatter={(value) =>
              discountType === "percentage"
                ? `${value}%`
                : `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ`
            }
            parser={(value) =>
              discountType === "percentage"
                ? value.replace("%", "")
                : value.replace(/đ\s?|(,*)/g, "")
            }
          />
        </Form.Item>

        <Form.Item name="minOrderValue" label="Giá trị đơn hàng tối thiểu">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"
            }
            parser={(value) => value.replace(/đ\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="usageLimit"
          label="Giới hạn sử dụng (0 = không giới hạn)"
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) =>
              value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Thời hạn áp dụng"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn thời hạn áp dụng",
            },
          ]}
        >
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            format="DD/MM/YYYY"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDiscountModal;
