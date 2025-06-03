import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import moment from "moment";
import Report from "../models/reportModel.js";

// Thống kê đơn hàng theo ngày/tháng/năm
export const getOrderTimeStats = async (req, res) => {
  try {
    const { period = "day", startDate, endDate } = req.query;

    let start, end;
    if (startDate && endDate) {
      // Neu co startDate va endDate
      start = moment(startDate)
        .startOf(period === "day" ? "day" : period)
        .toDate();
      end = moment(endDate)
        .endOf(period === "day" ? "day" : period)
        .toDate();
    } else {
      // Default for time
      end = moment().endOf("day").toDate(); // ket thuc cuoi ngay
      switch (period) {
        case "year":
          start = moment().startOf("year").toDate(); // Dau nam hien tai
          break;
        case "month":
          start = moment().startOf("month").toDate(); // Dau thang hien tai
          break;
        default: // day
          start = moment().startOf("day").toDate(); // Ngay hom nay
          break;
      }
    }

    let groupId;
    switch (period) {
      case "year":
        groupId = { $year: "$createdAt" };
        break;
      case "month":
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      default: // day
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
    }
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Loc don hang theo time
          status: "Delivered", // don thanh cong
        },
      },
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          date: { $min: "$createdAt" }, // Lấy một ngày bất kỳ trong nhóm
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // Tính tổng doanh thu từ các thống kê đã lấy được
    const overallTotalRevenue = stats.reduce(
      (sum, item) => sum + (item.totalRevenue || 0),
      0
    );
    // Update report totalRevenue
    await Report.findOneAndUpdate(
      { type: "total_revenue" },
      {
        $set: {
          type: "total_revenue",
          "data.totalRevenue.total": overallTotalRevenue,
          "data.totalRevenue.lastUpdated": new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Format the response
    const formattedStats = stats.map((item) => {
      let dateLabel;
      let actualDate;
      if (period === "year") {
        actualDate = moment().year(item._id.year).startOf("year");
      } else if (period === "month") {
        actualDate = moment()
          .year(item._id.year)
          .month(item._id.month - 1)
          .startOf("month");
      } else {
        //day
        actualDate = moment()
          .year(item._id.year)
          .month(item._id.month - 1)
          .date(item._id.day)
          .startOf("day");
      }

      switch (period) {
        case "year":
          dateLabel = actualDate.format("YYYY");
          break;
        case "month":
          dateLabel = actualDate.format("MM/YYYY");
          break;
        default:
          dateLabel = actualDate.format("DD/MM/YYYY");
      }

      return {
        date: dateLabel,
        totalOrders: item.totalOrders,
        totalRevenue: item.totalRevenue || 0,
        rawDate: actualDate.toDate(),
      };
    });

    res.status(200).json({ data: formattedStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thống kê sản phẩm tồn kho
export const getInventoryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    const products = await Product.find({
      // createdAt: { $gte: start, $lte: end },
    }).select("name stock stockStatus lastSoldDate");

    const totalProducts = products.length;
    const totalInStock = products.reduce((sum, p) => sum + p.stock, 0);
    const averageStock = totalProducts ? totalInStock / totalProducts : 0;

    const stockBreakdown = products.map((p) => ({
      product: p._id,
      name: p.name,
      stock: p.stock,
      stockStatus: p.stockStatus,
      lastSoldDate: p.lastSoldDate,
    }));

    // Cập nhật báo cáo tồn kho
    await Report.findOneAndUpdate(
      { type: "stock_status" },
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
        createdAt: new Date(),
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

// Thống kê sản phẩm bán chạy theo SỐ LƯỢNG
export const getBestSellersByQuantity = async (req, res) => {
  try {
    const { limit = 5, startDate, endDate } = req.query;

    let start, end;

    // Xử lý startDate để bao gồm từ đầu ngày
    if (startDate) {
      start = moment(startDate).startOf("day").toDate();
    } else {
      start = moment().subtract(1, "month").startOf("day").toDate(); // Mặc định từ đầu ngày của 1 tháng trước
    }

    // Xử lý endDate để bao gồm đến cuối ngày
    if (endDate) {
      end = moment(endDate).endOf("day").toDate();
    } else {
      end = moment().endOf("day").toDate(); // Mặc định đến cuối ngày hiện tại
    }

    const bestSellers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Lọc chính xác từ đầu ngày đến cuối ngày
          status: "Delivered",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          product: "$_id",
          name: "$productDetails.name",
          value: "$totalSold",
          stock: "$productDetails.stock",
        },
      },
    ]);
    // update report bestseller
    await Report.findOneAndUpdate(
      { type: "bestseller" },
      {
        type: "bestseller",
        data: {
          bestSellers: bestSellers.map((p) => ({
            product: p.product,
            name: p.name,
            value: p.sold,
            stock: p.stock,
          })),
        },
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ data: bestSellers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thống kê sản phẩm bán chạy theo DOANH THU
export const getBestSellersByRevenue = async (req, res) => {
  try {
    const { limit = 5, startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : moment().subtract(1, "month").toDate();
    const end = endDate ? new Date(endDate) : new Date();

    const bestSellers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: "Delivered",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          }, // Toanh doanh thu tu gia tai thoi diem mua
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          product: "$_id",
          name: "$productDetails.name",
          revenue: "$totalRevenue", // doanh thu cua spham
          stock: "$productDetails.stock",
          price: "$productDetails.price",
        },
      },
    ]);
    // Update report bestsellers
    await Report.findOneAndUpdate(
      { type: "bestseller_revenue" }, // loai bao cao
      {
        type: "bestseller_revenue",
        data: {
          bestSellers: bestSellers.map((p) => ({
            product: p.product,
            name: p.name,
            value: p.revenue,
            stock: p.stock,
          })),
        },
        createdAt: new Date(),
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

// Báo cáo động - Hàm điều hướng các loại báo cáo
export const getDynamicReport = async (req, res) => {
  const { type } = req.query;

  try {
    if (type === "product_status") {
      const products = await Product.find({});
      const sold = products.filter((p) => p.sold > 0).length;
      const unsold = products.length - sold;

      await Report.findOneAndUpdate(
        { type: "product_status" },
        {
          type: "product_status",
          data: {
            productStats: [
              { type: "Đã bán", value: sold },
              { type: "Chưa bán", value: unsold },
            ],
          },
          createdAt: new Date(),
        },
        { upsert: true, new: true }
      );

      return res.status(200).json([
        { type: "Đã bán", value: sold },
        { type: "Chưa bán", value: unsold },
      ]);
    }

    if (type === "bestseller_quantity") {
      // Gọi hàm lấy sản phẩm bán chạy theo số lượng
      return await getBestSellersByQuantity(req, res);
    }

    if (type === "bestseller_revenue") {
      // Gọi hàm lấy sản phẩm bán chạy theo doanh thu
      return await getBestSellersByRevenue(req, res);
    }

    res.status(400).json({ error: "Loại report không hợp lệ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tổng doanh thu
export const getTotalRevenue = async (req, res) => {
  try {
    const revenueReport = await Report.findOne({ type: "total_revenue" });
    const totalRevenue = revenueReport?.data?.totalRevenue?.total || 0;
    res.status(200).json({ data: { total: totalRevenue } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
