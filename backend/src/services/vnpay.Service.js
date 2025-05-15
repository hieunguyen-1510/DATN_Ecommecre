import crypto from "crypto";
import querystring from "qs";
import paymentModel from "../models/paymentModel.js";
import { sortObject } from "../utils/sortObject.js";

export const createVnpayPayment = async ({ amount, orderInfo, bankCode, ipAddr }) => {
  try {
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-:.]/g, "")
      .slice(0, 14);
    const orderId = date.getTime();

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
      vnp_TxnRef: orderId.toString(),
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
      orderId: null,
      status: "pending",
      method: "VNPay",
      transactionId: orderId.toString(),
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
    const vnpParams = { ...query };
    const secureHash = vnpParams["vnp_SecureHash"];

    // Xóa các trường không cần thiết
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    // Kiểm tra chữ ký
    const sortedParams = sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const secretKey = process.env.VNPAY_HASH_SECRET;
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

    return updatedPayment;
  } catch (error) {
    console.error("❌ handleVnpayIPN Error:", error);
    throw error;
  }
};