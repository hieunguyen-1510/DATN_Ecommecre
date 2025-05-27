import React, { useEffect, useState } from "react";
import useInventory from "../../hooks/useInventory";
import InventoryStats from "../../components/InventoryStats";
import InventoryFilters from "../../components/InventoryFilters";
import InventoryTable from "../../components/InventoryTable";
import DiscountModal from "../../components/DiscountModal";
import { Form, message } from "antd";
import axios from "axios";
import { backendUrl } from "../../App";

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

  // Discount modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [activeDiscountTab, setActiveDiscountTab] = useState("applyCode");
  const [createDiscountForm] = Form.useForm();
  const token = localStorage.getItem("token");

  // Fetch data on mount & when dependencies change
  useEffect(() => {
    fetchProducts({ pagination, search, statusFilter });
    fetchStats();
  }, [pagination.current, pagination.pageSize, search, statusFilter, fetchProducts]);

  // Discount handlers
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
      fetchProducts({ pagination, search, statusFilter });
    } catch (error) {
      message.error(error.response?.data?.message || "Áp dụng giảm giá thất bại");
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
      message.error(error.response?.data?.message || "Tạo mã giảm giá thất bại!");
    }
  };

  // Export Excel (dummy)
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
        />
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
      </div>
    </div>
  );
};

export default InventoryManagement;
