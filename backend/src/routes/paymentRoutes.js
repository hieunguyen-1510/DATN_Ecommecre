import express from "express";
import { verifyPaymentStatus } from "../middleware/verifyPayment.js";
import paymentController from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Tạo thanh toán MoMo
paymentRouter.post("/momo/create", paymentController.createMomoPayment);

// Xử lý IPN MoMo
paymentRouter.post("/momo/ipn", paymentController.handleMomoIPN);

// Kiểm tra trạng thái thanh toán MoMo
paymentRouter.get("/momo/status/:momoOrderId", paymentController.checkMomoPaymentStatus);

// Xử lý redirect từ MoMo sau khi thanh toán
paymentRouter.get("/momo_return", paymentController.handleMomoReturn);

// Trang thành công chung
paymentRouter.get("/success", paymentController.handleSuccess);

// Kiểm tra trạng thái đơn hàng
paymentRouter.get("/:orderId/status", paymentController.checkStatus);

// VNPay Routes
paymentRouter.post("/vnpay/create", verifyPaymentStatus, paymentController.createVnpayPayment);
paymentRouter.get("/vnpay/ipn", paymentController.handleVnpayIPN);
paymentRouter.get("/vnpay/status/:vnp_TxnRef", paymentController.checkVnpayPaymentStatus);
paymentRouter.get("/vnpay_return", paymentController.handleVnpayReturn);

export default paymentRouter;