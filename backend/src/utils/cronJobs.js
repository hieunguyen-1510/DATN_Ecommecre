import cron from "node-cron";
import Product from "../models/productModel.js";
import dayjs from "dayjs";

cron.schedule("0 0 * * *", async () => {
  try {
    const now = dayjs();
    await Product.updateMany({ discountExpiry: { $lt: now.toDate() } }, [
      {
        $set: {
          discountPercentage: null,
          discountAmount: null,
          discountCode: null,
          discountExpiry: null,
          finalPrice: "$price",
        },
      },
    ]);
    console.log("Đã xóa các mã giảm giá hết hạn");
  } catch (error) {
    console.error("Lỗi khi xóa mã giảm giá hết hạn:", error);
  }
});
