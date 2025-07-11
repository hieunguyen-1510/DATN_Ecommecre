import axios from "axios";
import { getAccessToken } from "../config/paypal.config.js";

export const createOrder = async (amount, options) => {
  console.log("📥 [paypal.service] Nhận vào:", { amount, options });
  try {
    const accessToken = await getAccessToken();
    const url = `${process.env.PAYPAL_API}/v2/checkout/orders`;

    const usdAmount = (amount / 24000).toFixed(2); // Đổi từ VND sang USD 

    const returnUrl = options.return_url || `${process.env.BACKEND_URL}/api/payment/success`;
    const cancelUrl = options.cancel_url || `${process.env.FRONTEND_URL}/payment-cancel`;


    // Debug log
    console.log("📥 [paypal.service] Nhận vào:", { amount, usdAmount, options });
    console.log("🔗 return_url:", returnUrl);
    console.log("🔗 cancel_url:", cancelUrl);

    // Log để debug
    // console.log("Tạo PayPal Order với amount:", amountVND, "USD:", usdAmount);
    // console.log("Options nhận vào:", options);

     const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: usdAmount,
          },
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn PayPal:", err.message);
    throw err;
  }
};

export const captureOrder = async (orderId) => {
  try {
    const accessToken = await getAccessToken();
    const url = `${process.env.PAYPAL_API}/v2/checkout/orders/${orderId}/capture`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(url, {}, { headers });
    return response.data;
  } catch (err) {
    console.error("Lỗi capture PayPal:", err.message);
    throw err;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const accessToken = await getAccessToken();
    const url = `${process.env.PAYPAL_API}/v2/checkout/orders/${orderId}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (err) {
    console.error("Lỗi lấy chi tiết đơn hàng PayPal:", err.message);
    throw err;
  }
};
