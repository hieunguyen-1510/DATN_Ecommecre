import cron from "node-cron";
import dayjs from "dayjs";
import Discount from "../models/discountModel.js";
import Product from "../models/productModel.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const now = dayjs();

    // Hết hạn các mã giảm giá
    await Discount.updateMany(
      {
        endDate: { $lt: now.toDate() },
        status: { $ne: "expired" },
      },
      { $set: { status: "expired" } }
    );

    // Tìm các sản phẩm có giảm giá hết hạn
    const expiredDiscountProducts = await Product.find({
      discountExpiry: { $lt: now.toDate() },
      discountCode: { $exists: true },
      isClearance: { $ne: true }, // k reset xa kho
    });

    const bulkResetOps = expiredDiscountProducts.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            discountPercentage: null,
            discountAmount: null,
            discountCode: null,
            discountExpiry: null,
            finalPrice: product.price, // Gán trực tiếp
          },
        },
      },
    }));

    if (bulkResetOps.length > 0) {
      await Product.bulkWrite(bulkResetOps);
    }

    console.log(`✅ Đã rest ${bulkResetOps.length} sản phẩm hết hạn giảm giá.`);
  } catch (error) {
    console.error("❌ Lỗi cron job đồng bộ mã giảm giá:", error);
  }
});
