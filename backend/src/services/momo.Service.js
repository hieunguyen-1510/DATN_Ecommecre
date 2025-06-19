import crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import paymentModel from "../models/paymentModel.js"; 
import Order from "../models/orderModel.js";
const momoEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
const momoQueryEndpoint = "https://test-payment.momo.vn/v2/gateway/api/query";

export const createMomoPayment = async ({ orderId, amount, orderInfo, orderData }) => {
  try {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;

    if (!partnerCode || !accessKey || !secretKey || !redirectUrl || !ipnUrl) {
      throw new Error("Thiếu thông tin cấu hình MoMo trong .env");
    }

    // Tạo unique momoOrderId và requestId cho MoMo
    const momoOrderId = `${partnerCode}${Date.now()}`;
    const requestId = momoOrderId;
  

    // ExtraData bạn muốn truyền, encode base64
    const extraData = Buffer.from(JSON.stringify(orderData || {})).toString("base64");

    console.log("Order data before encoding:", orderData);
    console.log("ExtraData (base64):", extraData);

    // Tạo raw signature theo doc MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

    // Tạo payload gửi lên MoMo
    const requestBody = JSON.stringify ({
      partnerCode,
      accessKey,
      requestId,
      amount: String(amount),
      orderId: momoOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType: "captureWallet",
      signature,
      lang: "en",
    });

    
    // Gửi request lên MoMo
    const response = await axios.post(momoEndpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("[MoMo Debug] Response Data:", response.data);

    if (!response.data.payUrl) {
      throw new Error("MoMo không trả về URL thanh toán");
    }

    // Lưu thông tin thanh toán vào DB
    const paymentRecord = await paymentModel.create({
      orderId: new mongoose.Types.ObjectId(orderId),
      status: "pending",
      method: "MOMO",
      transactionId: requestId, 
      amount,
      momo: {
      orderId: momoOrderId,
      request: JSON.parse(requestBody),
  },
    });

    return {
      payUrl: response.data.payUrl,
      paymentRecord,
    };
  } catch (error) {
    console.error("🚨 Lỗi tạo thanh toán MoMo:", error);
    throw new Error(error.response?.data?.message || error.message || "Lỗi hệ thống MoMo");
  }
};

export const handleMomoIPN = async (data) => {
  try {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;

    const expectedRawSignature = `accessKey=${accessKey}&amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(expectedRawSignature)
      .digest("hex");

    if (expectedSignature !== data.signature) {
      throw new Error("Chữ ký không hợp lệ");
    }

   const payment = await paymentModel.findOneAndUpdate(
  { transactionId: data.requestId },
  {
    status: data.resultCode === 0 ? "completed" : "failed",
    "momo.response": data,
  },
  { new: true }
);


    if (!payment) {
      throw new Error("Không tìm thấy giao dịch");
    }

    //  Nếu thanh toán thành công
    if (payment && data.resultCode === 0) {
      await Order.findByIdAndUpdate(
        payment.orderId,
        {
          status: "pending",
          paymentStatus: "completed",
          // $set: { "paymentId.status": "completed" }, 
        },
        { new: true }
      );
    }

    return payment;
  } catch (error) {
    console.error("🚨 Lỗi xử lý IPN:", error);
    throw error;
  }
};

export const checkStatusPayment = async ({ paymentId }) => {
  try {
    
    const payment = await paymentModel.findById(paymentId);
    if (!payment || !payment.momo?.orderId) {
      throw new Error("Không tìm thấy thông tin đơn hàng MoMo");
    }

    const momoOrderId = payment.momo.orderId;
    
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;

    const requestId = momoOrderId;
    const rawSignature = `accessKey=${accessKey}&orderId=${momoOrderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      requestId,
      momoOrderId,
      signature,
      lang: "en",
    };

    const response = await axios.post(momoQueryEndpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Lỗi kiểm tra trạng thái MoMo:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi kiểm tra trạng thái MoMo"
    );
  }
};
