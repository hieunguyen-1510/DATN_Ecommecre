import React, { useEffect, useState } from "react";
import useInventory from "../../hooks/useInventory";
import InventoryStats from "./InventoryStats";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import DiscountModal from "./DiscountModal";
import { Form, message, Select, Button, Modal, Input, InputNumber } from "antd";
import axios from "axios";
import { backendUrl } from "../../App";

const { Option } = Select;

const InventoryManagement = () => {
  const {
    products,
    stats,
    loading,
    updatingId,
    pagination,
    search,
    statusFilter,
    fetchProducts,
    fetchStats,
    handleUpdateStock,
    handlePagination,
    handleSearch,
    handleStatusFilter,
    setPagination,
  } = useInventory();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [activeDiscountTab, setActiveDiscountTab] = useState("applyCode");
  const [createDiscountForm] = Form.useForm();
  const [slowFilter, setSlowFilter] = useState("all");
  const [clearanceGroups, setClearanceGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [createGroupForm] = Form.useForm();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts({ pagination, search, statusFilter, slowFilter });
    fetchStats();
    fetchClearanceGroups();
  }, [
    pagination.current,
    pagination.pageSize,
    search,
    statusFilter,
    slowFilter,
  ]);

  const fetchClearanceGroups = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/clearance-groups`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClearanceGroups(response.data.data || []);
    } catch (err) {
      console.error("Failed to load clearance groups", err);
    }
  };

  const showDiscountModal = (product) => {
    setIsModalVisible(true);
    setSelectedProduct(product);
    setDiscountCode(product.discountCode || "");
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setDiscountCode("");
    setActiveDiscountTab("applyCode");
    createDiscountForm.resetFields();
  };

  const handleApplyDiscount = async () => {
    if (!selectedProduct) return;
    if (!discountCode) {
      message.error("Vui lòng nhập mã giảm giá.");
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/inventory/${selectedProduct._id}/apply-discount`,
        { code: discountCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Áp dụng giảm giá thành công");
      handleCancelModal();
      fetchProducts({ pagination, search, statusFilter, slowFilter });
    } catch (error) {
      message.error(
        error.response?.data?.message || "Áp dụng giảm giá thất bại"
      );
    }
  };

  const handleCreateDiscount = async (values) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/inventory/discounts`,
        {
          discountType: "percentage",
          value: values.percentage,
          endDate: values.expiryDate.toISOString(),
          note: values.note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Tạo mã giảm giá thành công!");
      createDiscountForm.resetFields();
      setDiscountCode(response.data.data.code);
      setActiveDiscountTab("applyCode");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Tạo mã giảm giá thất bại!"
      );
    }
  };

  const handleCreateClearanceGroup = async (values) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/clearance-groups`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Tạo nhóm xả kho thành công");
      setCreateGroupModalVisible(false);
      createGroupForm.resetFields();
      fetchClearanceGroups();
    } catch (error) {
      message.error("Tạo nhóm xả kho thất bại");
    }
  };

  const handleApplyClearanceGroup = async () => {
    if (!selectedGroupId || selectedProductIds.length === 0) {
      return message.warning("Vui lòng chọn nhóm xả kho và sản phẩm.");
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/clearance-groups/${selectedGroupId}/apply`,
        { productIds: selectedProductIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Áp dụng nhóm xả kho thành công"
      );
      fetchProducts({ pagination, search, statusFilter, slowFilter });
    } catch (err) {
      message.error("Áp dụng nhóm thất bại");
    }
  };
  //  console.log("Request body:", values); 

  const handleExportExcel = () => {
    message.info("Tính năng đang phát triển");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          Quản Lý Tồn Kho
        </h1>
        <InventoryStats stats={stats} />
        <InventoryFilters
          search={search}
          onSearch={handleSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilter}
          onExportExcel={handleExportExcel}
          slowFilter={slowFilter}
          onSlowFilterChange={setSlowFilter}
        />

        <div className="flex items-center gap-4 mb-4">
          <Select
            placeholder="Chọn nhóm xả kho"
            value={selectedGroupId}
            onChange={setSelectedGroupId}
            className="w-60"
          >
            {clearanceGroups.map((g) => (
              <Option key={g._id} value={g._id}>
                {g.name}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleApplyClearanceGroup}>
            Áp dụng nhóm xả kho
          </Button>
          <Button onClick={() => setCreateGroupModalVisible(true)}>
            Tạo nhóm xả kho
          </Button>
        </div>

        <InventoryTable
          products={products}
          loading={loading}
          updatingId={updatingId}
          onUpdateStock={handleUpdateStock}
          onShowDiscountModal={showDiscountModal}
          pagination={pagination}
          onChangePagination={(pagination) => {
            setPagination((prev) => ({
              ...prev,
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: prev.total,
            }));
          }}
          rowSelection={{
            selectedRowKeys: selectedProductIds,
            onChange: setSelectedProductIds,
          }}
        />
        <DiscountModal
          visible={isModalVisible}
          onCancel={handleCancelModal}
          onApplyDiscount={handleApplyDiscount}
          onCreateDiscount={handleCreateDiscount}
          activeTab={activeDiscountTab}
          setActiveTab={setActiveDiscountTab}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          createDiscountForm={createDiscountForm}
          productName={selectedProduct?.name}
        />
        <Modal
          title="Tạo nhóm xả kho mới"
          open={createGroupModalVisible}
          onCancel={() => setCreateGroupModalVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setCreateGroupModalVisible(false)}
            >
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => createGroupForm.submit()}
            >
              Tạo nhóm xả kho
            </Button>,
          ]}
        >
          <Form
            form={createGroupForm}
            layout="vertical"
            onFinish={handleCreateClearanceGroup}
          >
            <Form.Item
              label="Tên nhóm"
              name="name"
              rules={[{ required: true, message: "Nhập tên nhóm" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Loại giảm giá"
              name="discountType"
              rules={[{ required: true, message: "Chọn loại giảm giá" }]}
            >
              <Select>
                <Option value="percentage">Phần trăm</Option>
                <Option value="fixed_amount">Số tiền cố định</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Giá trị giảm"
              name="value"
              rules={[{ required: true, message: "Nhập giá trị giảm" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Ngày tạo trước (ISO)"
              name={["conditions", "createdBefore"]}
            >
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="Số lượng bán dưới"
              name={["conditions", "soldCountBelow"]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default InventoryManagement;
