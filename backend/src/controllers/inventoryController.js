import Product from "../models/productModel.js";
import Discount from "../models/discountModel.js";
import InventoryTransaction from "../models/inventoryTransactionModel.js";
import dayjs from "dayjs";

// Helper functions
const calculateStockStatus = (product) => {
  if (product.stock <= 0) return "critical";
  if (product.stock < product.stockThreshold * 0.3) return "critical";
  if (product.stock < product.stockThreshold) return "low";
  if (product.stock > product.overstockThreshold) return "overstock";
  return "normal";
};

export const updateProductStockStatus = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  const newStatus = calculateStockStatus(product);
  if (product.stockStatus !== newStatus) {
    product.stockStatus = newStatus;
    await product.save();
  }
  return product;
};

// Dashboard
export const getInventoryDashboard = async (req, res) => {
  try {
    const [totalProducts, lowStock, criticalStock, overstock] =
      await Promise.all([
        Product.countDocuments({ status: { $ne: "hidden" } }),
        Product.countDocuments({ stockStatus: "low" }),
        Product.countDocuments({ stockStatus: "critical" }),
        Product.countDocuments({ stockStatus: "overstock" }),
      ]);

    res.json({
      success: true,
      data: { totalProducts, lowStock, criticalStock, overstock },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi lấy thống kê tồn kho",
    });
  }
};

// Stock alerts
export const getStockAlerts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = { status: { $ne: "hidden" } };

    // Sửa phần lọc trạng thái
    if (status) {
      if (Array.isArray(status)) {
        query.stockStatus = { $in: status }; // Xử lý khi có nhiều trạng thái
      } else {
        query.stockStatus = status; // Xử lý khi chỉ có 1 trạng thái
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ stockStatus: -1, stock: 1 }),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi lấy danh sách cảnh báo",
    });
  }
};

// Update stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, transactionType, source, sourceId, note, createdBy } =
      req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const previousStock = product.stock;
    product.stock = stock;
    await product.save();

    // Create InventoryTransaction
    await InventoryTransaction.create({
      product: product._id,
      sku: product.sku, // Assuming product has sku
      transactionType: transactionType || "adjustment",
      quantity: Math.abs(stock - previousStock),
      previousStock: previousStock,
      newStock: stock,
      source: source || "manual_adjustment",
      sourceId: sourceId,
      note: note,
      createdBy: createdBy || req.user._id,
    });

    res.json({
      success: true,
      data: product,
      message: "Cập nhật tồn kho và ghi nhận giao dịch thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật tồn kho",
    });
  }
};

// Create discount
export const createDiscount = async (req, res) => {
  try {
    const {
      discountType,
      value,
      applicableProducts,
      minOrderValue,
      endDate,
      usageLimit,
    } = req.body;

    // Validation
    if (discountType === "percentage" && value > 100) {
      return res.status(400).json({
        success: false,
        message: "Giảm giá phần trăm không thể vượt quá 100%",
      });
    }

    const discount = new Discount({
      ...req.body,
      code: `DISCOUNT-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      createdBy: req.user._id,
      startDate: dayjs().toDate(),
      status: "active",
    });

    await discount.save();
    res.status(201).json({
      success: true,
      data: discount,
      message: "Tạo mã giảm giá thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tạo mã giảm giá",
    });
  }
};

// Apply discount
export const applyProductDiscount = async (req, res) => {
  try {
    const { productId } = req.params;
    const { code } = req.body;

    // Validate discount
    const discount = await Discount.findOne({ code });
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Mã giảm giá không tồn tại",
      });
    }

    // Check validity
    const now = dayjs();
    if (
      discount.status !== "active" ||
      now.isBefore(dayjs(discount.startDate)) ||
      now.isAfter(dayjs(discount.endDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá không khả dụng",
      });
    }

    // Check usage limit
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã hết lượt sử dụng",
      });
    }

    // Check product eligibility
    if (
      discount.applicableProducts.length > 0 &&
      !discount.applicableProducts.some((id) => id.equals(productId))
    ) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá không áp dụng cho sản phẩm này",
      });
    }

    // Apply discount
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        discountPercentage:
          discount.discountType === "percentage" ? discount.value : null,
        discountAmount:
          discount.discountType === "fixed_amount" ? discount.value : null,
        discountExpiry: discount.endDate,
        discountCode: discount.code,
      },
      { new: true }
    );

    // Update discount usage
    discount.usedCount += 1;
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      discount.status = "inactive";
    }
    await discount.save();

    res.json({
      success: true,
      data: product,
      message: `Áp dụng giảm giá thành công (${
        discount.discountType === "percentage"
          ? `${discount.value}%`
          : `$${discount.value}`
      })`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi áp dụng giảm giá",
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      status: { $ne: "hidden" },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tìm kiếm sản phẩm",
    });
  }
};
