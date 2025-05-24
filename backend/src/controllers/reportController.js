import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import moment from "moment";
import Report from "../models/reportModel.js";

// Thống kê đơn hàng theo ngày/tháng/năm
export const getOrderTimeStats = async (req, res) => {
  try {
    const { period = 'day', startDate, endDate } = req.query;
    
    // Validate input dates
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();
    
    // Format based on period
    let format, groupId;
    switch (period) {
      case 'year':
        format = '%Y';
        groupId = { $year: "$createdAt" };
        break;
      case 'month':
        format = '%Y-%m';
        groupId = { 
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
        break;
      default: // day
        format = '%Y-%m-%d';
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
    }
    
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          date: { $first: "$createdAt" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format the response
    const formattedStats = stats.map(item => {
      let dateLabel;
      const date = moment(item.date);
      
      switch (period) {
        case 'year':
          dateLabel = date.format('YYYY');
          break;
        case 'month':
          dateLabel = date.format('MM/YYYY');
          break;
        default:
          dateLabel = date.format('DD/MM/YYYY');
      }
      
      return {
        date: dateLabel,
        totalOrders: item.totalOrders,
        totalRevenue: item.totalRevenue,
        rawDate: item.date
      };
    });
    
    res.status(200).json({ data: formattedStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thống kê sản phẩm tồn kho theo thời gian
export const getInventoryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    // Aggregate inventory stats
    const products = await Product.find({
      createdAt: { $gte: start, $lte: end },
    }).select("stock stockStatus lastSoldDate");

    const totalProducts = products.length;
    const totalInStock = products.reduce((sum, p) => sum + p.stock, 0);
    const averageStock = totalProducts ? totalInStock / totalProducts : 0;

    const stockBreakdown = products.map(p => ({
      product: p._id,
      stock: p.stock,
      stockStatus: p.stockStatus,
      lastSoldDate: p.lastSoldDate,
    }));

    // Save to Report
    await Report.findOneAndUpdate(
      { type: "stock_status", createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      {
        type: "stock_status",
        data: {
          inventoryStats: {
            totalProducts,
            totalInStock,
            averageStock,
            stockBreakdown,
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      data: {
        totalProducts,
        totalInStock,
        averageStock,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thống kê sản phẩm bán chạy
export const getBestSellers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const bestSellers = await Product.find({ averageDailySales: { $gt: 0 } })
      .sort({ averageDailySales: -1 })
      .limit(parseInt(limit))
      .select("name averageDailySales stock");

    // Save to Report
    await Report.findOneAndUpdate(
      { type: "bestseller", createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      {
        type: "bestseller",
        data: {
          bestSellers: bestSellers.map(p => ({
            product: p._id,
            name: p.name,
            sold: p.averageDailySales,
            stock: p.stock,
          })),
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ data: bestSellers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Báo cáo trạng thái đơn hàng
export const generateOrderStatsReport = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.status(200).json({ data: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Báo cáo tồn kho theo sản phẩm
export const generateStockStatusReport = async (req, res) => {
  try {
    const products = await Product.find({}, "name stock");
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Báo cáo động theo type: product_status hoặc bestseller
export const getDynamicReport = async (req, res) => {
  const { type } = req.query;

  try {
    if (type === "product_status") {
      const products = await Product.find({});
      const sold = products.filter((p) => p.sold > 0).length;
      const unsold = products.length - sold;

      return res.status(200).json([
        { type: "Đã bán", value: sold },
        { type: "Chưa bán", value: unsold },
      ]);
    }

    if (type === "bestseller") {
      const topProducts = await Product.find({ sold: { $gt: 0 } })
        .sort({ sold: -1 })
        .limit(5)
        .select("name sold");

      return res.status(200).json(topProducts);
    }

    res.status(400).json({ error: "Loại report không hợp lệ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
