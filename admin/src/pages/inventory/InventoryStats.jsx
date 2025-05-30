import { Card, Statistic } from "antd";
import { CheckCircleOutlined, WarningOutlined, StockOutlined } from "@ant-design/icons";

const InventoryStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
      <Statistic
        title="Tổng sản phẩm"
        value={stats.totalProducts}
        prefix={<CheckCircleOutlined />}
        valueStyle={{ color: "#3f8600" }}
      />
    </Card>
    <Card>
      <Statistic
        title="Sắp hết hàng"
        value={stats.lowStock}
        prefix={<WarningOutlined />}
        valueStyle={{ color: "#faad14" }}
      />
    </Card>
    <Card>
      <Statistic
        title="Nguy cấp"
        value={stats.criticalStock}
        prefix={<WarningOutlined />}
        valueStyle={{ color: "#cf1322" }}
      />
    </Card>
    <Card>
      <Statistic
        title="Tồn kho nhiều"
        value={stats.overstock}
        prefix={<StockOutlined />}
        valueStyle={{ color: "#1890ff" }}
      />
    </Card>
  </div>
);

export default InventoryStats;
