import express from "express";
import paymentController from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// ---------- MoMo Payment ----------
paymentRouter.post("/momo/create", paymentController.createMomoPayment);
paymentRouter.post("/momo/ipn", paymentController.handleMomoIPN);      
paymentRouter.get("/momo/status/:momoOrderId", paymentController.checkMomoPaymentStatus);
paymentRouter.get("/momo_return", paymentController.handleMomoReturn); 

// ---------- PayPal Payment ----------
paymentRouter.post("/paypal/create", paymentController.createPaypalOrder);    
paymentRouter.post("/paypal/capture/:orderId", paymentController.capturePaypalOrder);
paymentRouter.get("/paypal/status/:paypalOrderId", paymentController.checkPaypalPaymentStatus);

// ---------- Common ----------
paymentRouter.get("/success", paymentController.handleSuccess); 
paymentRouter.get("/:orderId/status", paymentController.checkStatus);

export default paymentRouter;
