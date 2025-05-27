import { Input, Select, Button } from "antd";
import { FilterOutlined, FileExcelOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const InventoryFilters = ({
  search,
  onSearch,
  statusFilter,
  onStatusFilterChange,
  onExportExcel,
}) => (
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
        >
          <Option value="normal">Bình thường</Option>
          <Option value="low">Sắp hết</Option>
          <Option value="critical">Nguy cấp</Option>
          <Option value="out_of_stock">Hết hàng</Option>
          <Option value="overstock">Tồn kho nhiều</Option>
        </Select>
        <Button icon={<FileExcelOutlined />} onClick={onExportExcel}>
          Xuất Excel
        </Button>
      </div>
    </div>
  </div>
);

export default InventoryFilters;
