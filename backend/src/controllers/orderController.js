import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Report from "../models/reportModel.js";
import { createMomoPayment } from "../services/momo.Service.js";
import { updateUserRank } from "../controllers/customerController.js";
import { createOrder as createPaypalOrder } from "../services/paypal.service.js";
const generateTransactionId = () => {
  return `COD${Date.now()}`;
};

// COD Payment
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      address,
      paymentMethod,
      items,
      totalAmount,
      deliveryFee = 0,
    } = req.body;

    if (!userId || !address || !paymentMethod || !items?.length) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu thông tin userId, địa chỉ, phương thức thanh toán hoặc sản phẩm.",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "userId không hợp lệ, phải là một ObjectId hợp lệ.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại." });
    }

    let calculatedSubtotal = 0;
    // let totalCostOfOrder = 0;
    const processedItems = [];
    // Kiểm tra ton kho va lay chi tiet san pham
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm với ID ${item.productId} không tồn tại.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.name}" không đủ số lượng trong kho. Chỉ còn ${product.stock} sản phẩm.`,
        });
      }

      const itemTotal = (product.finalPrice || product.price) * item.quantity;
      calculatedSubtotal += itemTotal;

      processedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.finalPrice || product.price,
        size: item.size,
        purchasePriceAtOrder: product.purchasePrice,
      });
    }

    const finalAmount = calculatedSubtotal + deliveryFee;

    if (Math.abs(totalAmount - finalAmount) > 1) {
      return res.status(400).json({
        success: false,
        message: `Tổng số tiền không khớp. Client gửi: ${totalAmount}, Server tính: ${finalAmount}`,
      });
    }

    const methodUpper = paymentMethod.toUpperCase();
    const newOrder = new Order({
      userId,
      items: processedItems,
      totalAmount: finalAmount,
      deliveryFee,
      address,
      paymentMethod: methodUpper,
      status: methodUpper === "COD" ? "Order Placed" : "pending",
      // totalCost: totalCostOfOrder, // lưu tổng giá vốn của đơn hàng
    });

    const savedOrder = await newOrder.save();
    let responseData = { success: true, orderId: savedOrder._id };

    // Tạo transactionId
    const transactionId = generateTransactionId(savedOrder._id);

    const newPayment = new Payment({
      orderId: savedOrder._id,
      method: methodUpper,
      amount: finalAmount,
      status: methodUpper === "COD" ? "completed" : "pending",
      transactionId,
    });

    await newPayment.save();
    savedOrder.paymentId = newPayment._id;
    await savedOrder.save();

    // Cập nhật tồn kho và số lượng đã bán
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
        { new: true, runValidators: true }
      );
    }

    // MOMO Payment
    if (methodUpper === "MOMO") {
      try {
        const momoResult = await createMomoPayment({
          orderId: savedOrder._id,
          amount: finalAmount,
          orderInfo: `Thanh toán đơn hàng ${savedOrder._id}`,
        });

        console.log("MoMo Result:", momoResult);

        await Payment.findByIdAndUpdate(newPayment._id, {
          transactionId: momoResult.requestId,
        });

        if (!momoResult.payUrl) {
          throw new Error("MoMo không trả về payUrl");
        }

        newPayment.transactionId = momoResult.requestId || transactionId;
        newPayment.momoRequest = momoResult;
        await newPayment.save();

        responseData = {
          success: true,
          payUrl: momoResult.payUrl,
          orderId: savedOrder._id,
        };
      } catch (momoError) {
        console.error("Lỗi gọi MoMo API:", momoError);
        return res.status(500).json({
          success: false,
          message: "Không thể tạo thanh toán MoMo: " + momoError.message,
        });
      }
    }

    // PAYPAL Payment
    if (methodUpper === "PAYPAL") {
      try {
        const paypalResult = await createPaypalOrder(finalAmount, {
          return_url: `${process.env.BACKEND_URL}/api/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        });

        if (!paypalResult.id || !paypalResult.links) {
          throw new Error("Không thể tạo đơn hàng PayPal");
        }

        const approvalLink = paypalResult.links.find(
          (link) => link.rel === "approve"
        );

        if (!approvalLink) {
          throw new Error("Không tìm thấy đường dẫn approve từ PayPal");
        }

        // Lưu thông tin đơn thanh toán
        newPayment.transactionId = paypalResult.id;
        newPayment.paypalRequest = paypalResult;
        await newPayment.save();

        responseData = {
          success: true,
          payUrl: approvalLink.href,
          orderId: savedOrder._id,
          orderIdFromPaypal: paypalResult.id,
        };
      } catch (paypalError) {
        console.error("Lỗi tạo đơn hàng PayPal:", paypalError);
        // Hủy đơn hàng
        await savedOrder.remove();
        await newPayment.remove();

        return res.status(500).json({
          success: false,
          message: "Không thể tạo thanh toán PayPal: " + paypalError.message,
        });
      }
    }

    // delete cart
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
    if (!cart) {
      console.warn("Không tìm thấy giỏ hàng để cập nhật:", userId);
    }

    // cập nhật hạng khách hàng
    await updateUserRank(userId);

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi đặt hàng.",
    });
  }
};

// GET all orders
const allOrders = async (req, res) => {
  try {
    // Kiểm tra kết nối MongoDB
    if (!mongoose.connection.readyState) {
      return res.status(500).json({
        success: false,
        message: "Không thể kết nối tới cơ sở dữ liệu",
      });
    }

    // Xử lý cả GET và POST method
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng nào.",
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server. Không thể lấy đơn hàng.",
    });
  }
};

// Get Order Detail
const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .populate("paymentId")
      .populate("userId", "name email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    // Nếu không phải admin và user
    if (
      req.user.role !== "admin" &&
      req.user.id !== order.userId._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập đơn hàng này.",
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng người dùng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Get order status
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).select("status");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng.",
      });
    }

    res.json({
      success: true,
      status: order.status,
    });
  } catch (error) {
    console.error("Lỗi lấy trạng thái đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// cancel order user
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    if (req.user.id !== order.userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền hủy đơn hàng này." });
    }

    if (order.status !== "Order Placed" && order.status !== "Processing") {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy đơn hàng ở trạng thái hiện tại.",
      });
    }

    order.status = "Cancelled";
    order.cancelReason = cancelReason;
    await order.save();
    // Hoàn lại số lượng sản phẩm vào kho
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity, sold: -item.quantity } },
        { new: true, runValidators: true }
      );
    }

    res.json({ success: true, message: "Hủy đơn hàng thành công.", order });
  } catch (error) {
    console.error("Lỗi hủy đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Refunded",
    ];

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId hoặc status",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    // Populate userId để lấy thông tin người dùng
    const order = await Order.findById(orderId).populate(
      "userId",
      "name email"
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng.",
      });
    }
    const oldStatus = order.status;

    // Logic kiểm tra chuyển đổi trạng thái hợp lệ
    if (oldStatus === "Delivered" && status !== "Refunded") {
      return res.status(400).json({
        success: false,
        message:
          "Không thể thay đổi trạng thái từ 'Đã giao' trừ khi là 'Hoàn tiền'",
      });
    }
    if (oldStatus === "Cancelled" && status !== "Refunded") {
      return res.status(400).json({
        success: false,
        message:
          "Không thể thay đổi trạng thái từ 'Đã hủy' trừ khi là 'Hoàn tiền'",
      });
    }

    // Cập nhật tồn kho và số lượng đã bán
    if (
      ["Delivered", "Processing", "Shipped", "Order Placed"].includes(
        oldStatus
      ) &&
      ["Cancelled", "Refunded"].includes(status)
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity, sold: -item.quantity } },
          { new: true, runValidators: true }
        );
      }
    } else if (
      oldStatus === "pending" &&
      status === "Order Placed" &&
      order.paymentMethod !== "COD"
    ) {
      // Trường hợp từ pending cho thanh toán online
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              stock: -item.quantity,
              sold: item.quantity,
            },
          },
          { new: true, runValidators: true }
        );
      }
    }

    // Cập nhật Order
    order.status = status;
    await order.save();

    let paymentStatus;
    if (status === "Delivered") {
      paymentStatus = "completed";

      // Cộng doanh thu khi chuyển thành Delivered
      let revenueReport = await Report.findOne({ type: "total_revenue" });
      if (!revenueReport) {
        revenueReport = new Report({
          type: "total_revenue",
          data: { totalRevenue: { total: 0, lastUpdated: new Date() } },
        });
      }
      revenueReport.data.totalRevenue.total += order.totalAmount;
      revenueReport.data.totalRevenue.lastUpdated = new Date();
      await revenueReport.save();
    } else if (status === "Cancelled" || status === "Refunded") {
      paymentStatus = "refunded";
    } else {
      paymentStatus = "pending";
    }

    await Payment.findOneAndUpdate({ orderId }, { status: paymentStatus });
    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      order: await Order.findById(orderId).populate("items.productId"),
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi cập nhật trạng thái",
    });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  getOrderDetail,
  getOrderStatus,
  cancelOrder,
};
