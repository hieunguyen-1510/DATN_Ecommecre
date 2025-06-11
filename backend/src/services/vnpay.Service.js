import crypto from "crypto";
import qs from "qs";

import Payment from "../models/paymentModel.js";

export const createVnpayPayment = async ({
  amount,
  orderInfo,
  bankCode,
  ipAddr,
  orderId,
}) => {
  try {
    if (!amount || !orderInfo || !ipAddr || !orderId) {
      throw new Error("Thiếu tham số bắt buộc");
    }

    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET?.trim();
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      throw new Error("Thiếu cấu hình VNPay");
    }

    const amountNumber = Math.floor(Number(amount));
    if (isNaN(amountNumber) || amountNumber <= 0) {
      throw new Error("Số tiền không hợp lệ");
    }

    const date = new Date();
    const createDate = formatDate(date, "yyyyMMddHHmmss");
    const expireDate = formatDate(
      new Date(date.getTime() + 15 * 60000),
      "yyyyMMddHHmmss"
    );
    const transactionId = `ORD${Date.now()}`;

    // Chuẩn hóa orderInfo
    const normalizedOrderInfo = orderInfo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    let vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: amountNumber * 100,
      vnp_CreateDate: createDate,
      vnp_CurrCode: "VND",
      vnp_IpAddr: ipAddr === "::1" ? "127.0.0.1" : ipAddr,
      vnp_Locale: "vn",
      vnp_OrderInfo: normalizedOrderInfo,
      vnp_OrderType: "other",
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: transactionId,
      vnp_ExpireDate: expireDate,
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sắp xếp tham số và ép kiểu string toàn bộ
    vnpParams = sortObject(vnpParams);
    Object.keys(vnpParams).forEach((key) => {
      vnpParams[key] = String(vnpParams[key]);
    });

    // Tạo chữ ký
    const signData = qs.stringify(vnpParams, { encode: false });
    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    vnpParams.vnp_SecureHashType = "SHA512";
    vnpParams.vnp_SecureHash = secureHash;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnpParams, { encode: true })}`;

    // Lưu database
    await Payment.create({
      orderId,
      method: "VNPAY",
      amount: amountNumber,
      transactionId,
      status: "pending",
      vnpayResponse: vnpParams,
    });

    console.log("✅ SignData:", signData);
    console.log("✅ SecureHash:", secureHash);
    console.log("🔗 Payment URL:", paymentUrl);

    return paymentUrl;
  } catch (err) {
    console.error("❌ VNPay Error:", err);
    throw err;
  }
};

// Hàm định dạng ngày
function formatDate(date, format) {
  const pad = (num) => num.toString().padStart(2, "0");
  return format
    .replace("yyyy", date.getFullYear())
    .replace("MM", pad(date.getMonth() + 1))
    .replace("dd", pad(date.getDate()))
    .replace("HH", pad(date.getHours()))
    .replace("mm", pad(date.getMinutes()))
    .replace("ss", pad(date.getSeconds()));
}

// Hàm sắp xếp object theo key
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export const handleVnpayIPN = async (query) => {
  try {
    console.log("VNPay IPN received:", query);
    const secretKey = process.env.VNPAY_HASH_SECRET?.trim();
    if (!secretKey) {
      throw new Error("Missing VNPAY_HASH_SECRET environment variable.");
    }

    let vnpParams = { ...query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);
    const signData = qs.stringify(vnpParams, { encode: false });

    console.log("IPN Data to be signed:", signData);

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("Calculated signature:", signed);
    console.log("Received signature:", secureHash);

    if (secureHash !== signed) {
      console.error("Signature mismatch", {
        calculated: signed,
        received: secureHash,
      });
      return { RspCode: "97", Message: "Fail checksum" };
    }

    const transactionId = vnpParams["vnp_TxnRef"];
    const responseCode = vnpParams["vnp_ResponseCode"];
    const amountReceived = parseInt(vnpParams["vnp_Amount"]) / 100;

    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return { RspCode: "01", Message: "Order not found" };
    }

    if (payment.amount !== amountReceived || payment.status === "completed") {
      return { RspCode: "04", Message: "Invalid amount or already processed" };
    }

    payment.status = responseCode === "00" ? "completed" : "failed";
    payment.vnpayResponse = vnpParams;
    await payment.save();

    return { RspCode: "00", Message: "success" };
  } catch (error) {
    console.error("❌ handleVnpayIPN Error:", error);
    return { RspCode: "99", Message: error.message };
  }
};

export const handleVnpayReturn = async (query) => {
  try {
    console.log("VNPay Return received:", query);
    const secretKey = process.env.VNPAY_HASH_SECRET?.trim();
    if (!secretKey) {
      throw new Error("Missing VNPAY_HASH_SECRET environment variable.");
    }

    let vnpParams = { ...query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);
    const signData = qs.stringify(vnpParams, { encode: false });

    console.log("Return Data to be signed:", signData);

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("Calculated SecureHash:", signed);
    console.log("Received SecureHash:", secureHash);

    if (secureHash !== signed) {
      console.error("Signature mismatch", {
        calculated: signed,
        received: secureHash,
      });
      throw new Error("Invalid signature.");
    }

    const vnpResponseCode = vnpParams["vnp_ResponseCode"];
    const transactionId = vnpParams["vnp_TxnRef"];

    return {
      transactionId: transactionId,
      status: vnpResponseCode === "00" ? "completed" : "failed",
      vnpParams,
    };
  } catch (error) {
    console.error("❌ handleVnpayReturn Error:", error);
    throw error;
  }
};
