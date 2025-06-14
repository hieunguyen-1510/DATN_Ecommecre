import { Input, Select, Button, Tag } from "antd";
import { FilterOutlined, FileExcelOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const InventoryFilters = ({
  search,
  onSearch,
  statusFilter,
  onStatusFilterChange,
  onExportExcel,
  slowFilter,
  onSlowFilterChange,
}) => {
  // Định nghĩa map màu và nhãn giống
  const colorMap = {
    normal: "green",
    critical: "red",
    low: "orange",
    overstock: "blue",
    out_of_stock: "volcano",
  };
  const labelMap = {
    normal: "Bình thường",
    critical: "Thiếu nghiêm trọng",
    low: "Sắp hết",
    overstock: "Dư thừa",
    out_of_stock: "Hết hàng",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          enterButton
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onSearch={onSearch}
          className="w-full md:w-96"
        />
        <div className="flex flex-wrap gap-2">
          <Select
            mode="multiple"
            placeholder="Lọc trạng thái"
            maxTagCount="responsive"
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-48"
            suffixIcon={<FilterOutlined />}
            optionRender={(option) => (
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colorMap[option.value] }}
                ></span>
                <span>{labelMap[option.value]}</span>
              </div>
            )}
          >
            <Option value="normal">Bình thường</Option>
            <Option value="low">Sắp hết</Option>
            <Option value="critical">Nguy cấp</Option>
            <Option value="out_of_stock">Hết hàng</Option>
            <Option value="overstock">Tồn kho nhiều</Option>
          </Select>

          <Select
            placeholder="Lọc sản phẩm bán chậm"
            value={slowFilter}
            onChange={onSlowFilterChange}
            className="w-48"
          >
            <Option value="all">Tất cả sản phẩm</Option>
            <Option value="slow">Sản phẩm bán chậm</Option>
          </Select>

          <Button icon={<FileExcelOutlined />} onClick={onExportExcel}>
            Xuất Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
