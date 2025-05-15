import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { createMomoPayment } from "../services/momo.Service.js";

const generateTransactionId = (orderId) => {
  return `TXN_${orderId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod, items, totalAmount, deliveryFee = 0 } = req.body;

    if (!userId || !address || !paymentMethod || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin userId, địa chỉ, phương thức thanh toán hoặc sản phẩm.",
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
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
    }

    let calculatedSubtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm với ID ${item.productId} không tồn tại.`,
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      processedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
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
    });

    const savedOrder = await newOrder.save();
    let responseData = { success: true, orderId: savedOrder._id };

    // Tạo transactionId duy nhất ngay từ đầu
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

    if (methodUpper === "MOMO") {
  try {
    const momoResult = await createMomoPayment({
      orderId: savedOrder._id,
      amount: finalAmount,
      orderInfo: `Thanh toán đơn hàng ${savedOrder._id}`,
    });

    console.log("MoMo Result:", momoResult);

    await Payment.findByIdAndUpdate(
      newPayment._id,
      {
        transactionId: momoResult.requestId,
      }
    );

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
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
    if (!cart) {
      console.warn("Không tìm thấy giỏ hàng để cập nhật:", userId);
    }

    console.log("Response Data sent to frontend:", responseData); // Thêm log
    res.status(201).json(responseData);
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi đặt hàng.",
    });
  }
};

// VNPay Payment
const placeOrderVNPay = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Chuyển hướng đến VNPay",
      redirectUrl: "#",
    });
  } catch (error) {
    console.error("Lỗi VNPay:", error);
    res.status(500).json({ success: false, message: "Lỗi thanh toán VNPay" });
  }
};

// GET all orders
const allOrders = async (req, res) => {
  try {
    // Kiểm tra kết nối MongoDB
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ success: false, message: "Không thể kết nối tới cơ sở dữ liệu" });
    }

    // Tìm tất cả đơn hàng 
    const orders = await Order.find()
      .populate("userId", "name email") 
      .populate("items.productId")      
      .sort({ createdAt: -1 });         

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "Không có đơn hàng nào." });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error.message); 
    res.status(500).json({ success: false, message: "Lỗi server. Không thể lấy đơn hàng." });
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
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    // Nếu không phải admin và không phải chủ đơn thì không cho xem
    if (req.user.role !== "admin" && req.user.id !== order.userId._id.toString()) {
      return res.status(403).json({ success: false, message: "Không có quyền truy cập đơn hàng này." });
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
        message: "Không tìm thấy đơn hàng." 
      });
    }
    
    res.json({ 
      success: true, 
      status: order.status 
    });
  } catch (error) {
    console.error("Lỗi lấy trạng thái đơn hàng:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server" 
    });
  }
};
// cancel order user
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    if (req.user.id !== order.userId.toString()) {
      return res.status(403).json({ success: false, message: "Không có quyền hủy đơn hàng này." });
    }

    if (order.status !== "Order Placed" && order.status !== "Processing") {
      return res.status(400).json({ success: false, message: "Không thể hủy đơn hàng ở trạng thái hiện tại." });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Hủy đơn hàng thành công.", order });
  } catch (error) {
    console.error("Lỗi hủy đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Chỉ admin mới có quyền cập nhật trạng thái." });
    }

    const { orderId, status } = req.body;
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate("items.productId");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


export {placeOrder,placeOrderVNPay,allOrders,userOrders, updateStatus,getOrderDetail,getOrderStatus,cancelOrder};