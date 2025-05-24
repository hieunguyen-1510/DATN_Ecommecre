import Discount from "../models/discountModel.js";

// Tạo mã giảm giá mới
export const createDiscount = async (req, res) => {
  try {
    const {
      code,
      discountType,
      value,
      applicableProducts,
      minOrderValue,
      startDate,
      endDate,
      usageLimit,
    } = req.body;

    // Debug log
    // console.log("Authenticated User:", req.user);
    
    // Validate
    if (!req.user._id) {
      return res.status(400).json({
        success: false,
        message: "Không xác định được người tạo"
      });
    }

    const discount = new Discount({
      code,
      discountType,
      value,
      applicableProducts,
      minOrderValue,
      startDate,
      endDate,
      usageLimit,
      createdBy: req.user._id 
    });

    await discount.save();

    res.status(201).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update discounts
export const updateDiscount = async (req, res) => {
  try {
    const updated = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete discounts
export const deleteDiscount = async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa mã giảm giá' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách mã giảm giá
export const getDiscounts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;

    const discounts = await Discount.find(query)
      .populate("applicableProducts", "name price image")
      .populate("createdBy", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Discount.countDocuments(query);

    res.json({
      success: true,
      data: discounts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Áp dụng mã giảm giá
export const applyDiscount = async (req, res) => {
  try {
    const { code, productId } = req.body;

    //  Kiểm tra mã giảm giá
    const discount = await Discount.findOne({ code });
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Mã giảm giá không tồn tại",
      });
    }

    // Kiểm tra điều kiện
    const now = new Date();
    if (
      discount.status !== "active" ||
      now < discount.startDate ||
      now > discount.endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá không khả dụng",
      });
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã hết lượt sử dụng",
      });
    }

    // Kiểm tra sản phẩm áp dụng
    if (
      discount.applicableProducts.length > 0 &&
      !discount.applicableProducts.map((p) => p.toString()).includes(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá không áp dụng cho sản phẩm này",
      });
    }

    // Cập nhật lượt sử dụng
    discount.usedCount += 1;
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      discount.status = "inactive";
    }
    await discount.save();

    res.json({
      success: true,
      data: {
        code: discount.code,
        discountType: discount.discountType,
        value: discount.value,
        applicableProducts: discount.applicableProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy thông tin chi tiết 1 mã giảm giá
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id)
      .populate("applicableProducts", "name price image")
      .populate("createdBy", "name email");
    
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã giảm giá",
      });
    }

    res.json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
