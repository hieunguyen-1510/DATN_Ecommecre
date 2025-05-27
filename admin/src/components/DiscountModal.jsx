import { Modal, Tabs, Form, Input, Button, DatePicker } from "antd";

const { TabPane } = Tabs;
const { TextArea } = Input;

const DiscountModal = ({
  visible,
  onCancel,
  onApplyDiscount,
  onCreateDiscount,
  activeTab,
  setActiveTab,
  discountCode,
  setDiscountCode,
  createDiscountForm,
  productName,
}) => (
  <Modal
    visible={visible}
    onCancel={onCancel}
    title={`Áp dụng/Tạo mã giảm giá cho: ${productName || ""}`}
    footer={null}
    destroyOnClose
  >
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane tab="Áp dụng mã" key="applyCode">
        <Input
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="mb-3"
        />
        <Button type="primary" block onClick={onApplyDiscount}>
          Áp dụng
        </Button>
      </TabPane>
      <TabPane tab="Tạo mã mới" key="create">
        <Form form={createDiscountForm} layout="vertical" onFinish={onCreateDiscount}>
          <Form.Item
            label="Phần trăm giảm giá (%)"
            name="percentage"
            rules={[{ required: true, message: "Nhập phần trăm giảm giá" }]}
          >
            <Input type="number" min={1} max={100} />
          </Form.Item>
          <Form.Item
            label="Ngày hết hạn"
            name="expiryDate"
            rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <TextArea rows={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo mã giảm giá
          </Button>
        </Form>
      </TabPane>
    </Tabs>
  </Modal>
);

export default DiscountModal;
