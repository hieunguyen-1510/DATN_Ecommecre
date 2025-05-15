import express from "express";
import { verifyPaymentStatus } from "../middleware/verifyPayment.js";
import paymentController from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Tạo thanh toán MoMo
paymentRouter.post("/momo/create", paymentController.createMomoPayment);

// Xử lý IPN MoMo (notification)
paymentRouter.post("/momo/ipn", paymentController.handleMomoIPN);

// Kiểm tra trạng thái thanh toán MoMo 
paymentRouter.get("/momo/status/:momoOrderId", paymentController.checkMomoPaymentStatus);

// Tạo thanh toán VNPAY (dùng middleware verifyPaymentStatus)
paymentRouter.post("/vnpay/create", verifyPaymentStatus, paymentController.createVnpayPayment);

// Xử lý IPN VNPAY (notification)
paymentRouter.get("/vnpay/ipn", paymentController.handleVnpayIPN);

// Xử lý khi redirect về thành công sau thanh toán chung
paymentRouter.get("/success", paymentController.handleSuccess);

// Kiểm tra trạng thái đơn hàng theo orderId chung
paymentRouter.get("/:orderId/status", paymentController.checkStatus);

export default paymentRouter;
