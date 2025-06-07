import cron from "node-cron";
import dayjs from "dayjs";
import Discount from "../models/discountModel.js";
import Product from "../models/productModel.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const now = dayjs();

    // Cập nhật trạng thái mã giảm giá hết hạn
    await Discount.updateMany(
      {
        endDate: { $lt: now.toDate() },
        status: { $ne: "expired" },
      },
      { $set: { status: "expired" } }
    );

    // Xóa giảm giá hết hạn khỏi các sản phẩm
    await Product.updateMany(
      {
        discountExpiry: { $lt: now.toDate() },
        discountCode: { $exists: true },
      },
      {
        $set: {
          discountPercentage: null,
          discountAmount: null,
          discountCode: null,
          discountExpiry: null,
          finalPrice: "$price", // Reset về giá gốc
        },
      }
    );

    console.log("✅ Đã đồng bộ trạng thái mã giảm giá hết hạn");
  } catch (error) {
    console.error("❌ Lỗi cron job:", error);
  }
});
