import { Table, InputNumber, Spin, Progress, Tag, Button } from "antd";

const InventoryTable = ({
  products,
  loading,
  updatingId,
  onUpdateStock,
  onShowDiscountModal,
  pagination,
  onChangePagination,
  rowSelection,
}) => {
  const colorMap = {
    normal: "green",
    critical: "red",
    low: "orange",
    overstock: "blue",
    out_of_stock: "volcano",
  };
  const labelMap = {
    normal: "Còn hàng",
    critical: "Nguy cấp",
    low: "Sắp hết",
    overstock: "Tồn kho nhiều",
    out_of_stock: "Hết hàng",
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image?.[0] || "/placeholder-product.png"}
            alt={text}
            className="w-10 h-10 object-cover mr-2 rounded"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="capitalize">{text}</span>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 150,
      render: (text, record) => (
        <div>
          <div className="flex items-center mb-1">
            <InputNumber
              min={0}
              value={text}
              onChange={(value) => onUpdateStock(record._id, value)}
              className="w-24 mr-2"
              disabled={updatingId === record._id}
            />
            <Spin spinning={updatingId === record._id} />
          </div>
          <Progress
            percent={Math.min(
              (text /
                (record.stockStatus === "overstock"
                  ? record.overstockThreshold
                  : record.stockThreshold)) *
                100,
              100
            )}
            status={
              record.stockStatus === "out_of_stock"
                ? "exception"
                : record.stockStatus === "critical"
                ? "exception"
                : record.stockStatus === "low"
                ? "active"
                : "normal"
            }
            showInfo={false}
            strokeColor={
              record.stockStatus === "out_of_stock"
                ? "#ff4d4f"
                : record.stockStatus === "critical"
                ? "#ff4d4f"
                : record.stockStatus === "low"
                ? "#faad14"
                : record.stockStatus === "overstock"
                ? "#1890ff"
                : "#52c41a"
            }
          />
        </div>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Trạng thái",
      dataIndex: "stockStatus",
      key: "stockStatus",
      width: 150,
      render: (status) => {
        return (
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: colorMap[status] }}
            title={labelMap[status]}
          ></span>
        );
      },
    },
    {
      title: "Giảm giá",
      key: "discount",
      render: (_, record) => {
        if (record.discountPercentage) {
          return <Tag color="purple">{record.discountPercentage}%</Tag>;
        }
        if (record.discountAmount) {
          return <Tag color="purple">{record.discountAmount} VNĐ</Tag>;
        }
        return "-";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => onShowDiscountModal(record)}>
          Áp dụng giảm giá
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey="_id"
      pagination={{
        ...pagination,
        showTotal: (total) => `Tổng ${total} sản phẩm`,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
      }}
      onChange={onChangePagination}
      scroll={{ x: 1000 }}
      rowSelection={rowSelection}
    />
  );
};

export default InventoryTable;
