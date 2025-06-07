import crypto from "crypto";
import querystring from "qs";
import paymentModel from "../models/paymentModel.js";
import { sortObject } from "../utils/sortObject.js";

export const createVnpayPayment = async ({ amount, orderInfo, bankCode, ipAddr, orderId }) => {
  try {

   // Kiểm tra biến môi trường
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      throw new Error("Thiếu các biến môi trường cần thiết cho VNPay");
    }

    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-:.]/g, "")
      .slice(0, 14);

    // Tạo tham số VNPay
    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: createDate,
      vnp_CurrCode: "VND",
      vnp_IpAddr: ipAddr,
      vnp_Locale: "vn",
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: orderId, 
      vnp_ExpireDate: new Date(date.getTime() + 15 * 60000)
        .toISOString()
        .replace(/[-:.]/g, "")
        .slice(0, 14),
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sắp xếp và ký dữ liệu
    const sortedParams = sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    sortedParams.vnp_SecureHash = signed;

    // Tạo URL thanh toán
    const queryString = querystring.stringify(sortedParams, { encode: false });
    const url = `${vnpUrl}?${queryString}`;

    // Lưu vào database
    await paymentModel.create({
      orderId,
      status: "pending",
      method: "VNPay",
      transactionId: orderId,
      vnpayResponse: sortedParams,
    });

    return url;
  } catch (error) {
    console.error("❌ createVnpayPayment Error:", error);
    throw error;
  }
};

export const handleVnpayIPN = async (query) => {
  try {
    const secretKey = process.env.VNPAY_HASH_SECRET;
    if (!secretKey) {
      throw new Error("Thiếu VNPAY_HASH_SECRET trong biến môi trường");
    }

    const vnpParams = { ...query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    // Kiểm tra chữ ký
    const sortedParams = sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      throw new Error("Chữ ký không hợp lệ");
    }

    // Cập nhật trạng thái thanh toán
    const responseCode = vnpParams["vnp_ResponseCode"];
    const status = responseCode === "00" ? "completed" : "failed";

    const updatedPayment = await paymentModel.findOneAndUpdate(
      { transactionId: vnpParams["vnp_TxnRef"] },
      { status, vnpayResponse: vnpParams },
      { new: true }
    );

    if (!updatedPayment) {
      throw new Error("Không tìm thấy giao dịch với transactionId: " + vnpParams["vnp_TxnRef"]);
    }

    if (status === "completed") {
      const order = await Order.findById(updatedPayment.orderId);
      if (order) {
        order.status = "Delivered";
        order.paymentStatus = "completed";
        await order.save();

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
      }
    }

    return updatedPayment;
    
  } catch (error) {
    console.error("❌ handleVnpayIPN Error:", error);
    throw error;
  }
};