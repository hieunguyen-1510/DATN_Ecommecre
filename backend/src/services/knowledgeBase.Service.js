import FAQ from "../models/faqsModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const getRelatedFAQs = async (query) => {
  const faqs = await FAQ.find({
    $or: [
      { question: { $regex: query, $options: "i" } },
      { keywords: { $regex: query, $options: "i" } },
    ],
  }).limit(3);
  return faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");
};

export const getProductInfo = async (productName) => {
  const products = await Product.find({
    $or: [
      { name: { $regex: productName, $options: "i" } },
      { description: { $regex: productName, $options: "i" } },
    ],
  }).limit(3);

  if (products.length > 0) {
    return products
      .map((p) => `Tên: ${p.name}, Giá: ${p.price}, Mô tả: ${p.description}`)
      .join("\n");
  }
  return null;
};

export const getOderStatus = async (orderCode, userId) => {
  let order = null;
  // Nếu người dùng nhập mã đơn hàng đầy đủ (24 ký tự)
  if (/^[a-fA-F0-9]{24}$/.test(orderCode)) {
    order = await Order.findOne({ _id: orderCode, userId: userId });
  }
  // Nếu người dùng chỉ nhập 6 ký tự cuối
  if (!order && orderCode.length === 6) {
    const orders = await Order.find({ userId });

    order = orders.find(
      (o) =>
        o._id.toString().slice(-6).toLowerCase() === orderCode.toLowerCase()
    );
  }

  if (order) {
    return `Đơn hàng #${order._id
      .toString()
      .slice(-6)} của bạn đang có trạng thái: ${order.status}.`;
  }
  return null;
};

// Hàm tổng hợp Knowledge
export const buildKnowledgeBaseString = async (userMessage, userId = null) => {
  let kb = "";

  const relatedFAQs = await getRelatedFAQs(userMessage);
  if (relatedFAQs) {
    kb += "--- Câu hỏi thường gặp liên quan ---\n" + relatedFAQs + "\n\n";
  }

  const productInfo = await getProductInfo(userMessage);
  if (productInfo) {
    kb += "--- Thông tin sản phẩm liên quan ---\n" + productInfo + "\n\n";
  }

  if (
    userId &&
    (userMessage.toLowerCase().includes("đơn hàng") ||
      userMessage.toLowerCase().includes("trạng thái đơn hàng"))
  ) {
    const orderIdMatch = userMessage.match(/\d{24}|[a-f0-9]{24}/);

    if (orderIdMatch) {
      const orderStatus = await getOderStatus(orderIdMatch[0], userId);
      if (orderStatus) {
        kb += "--- Trạng thái đơn hàng của bạn ---\n" + orderStatus + "\n\n";
      } else {
        kb +=
          "--- Không tìm thấy đơn hàng với mã này hoặc không thuộc về bạn. ---\n\n";
      }
    }
  }
  return kb;
};
