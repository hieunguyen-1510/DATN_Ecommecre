import mongoose from "mongoose";

const clearanceGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discountType: {
    type: String,
    enum: ["percentage", "fixed_amount"],
    required: true,
  },
  value: { type: Number, required: true },
  conditions: {
    createdBefore: Date, //sản phẩm được tạo trước 6 tháng
    soldCountBelow: Number  //số lượng bán < 5
  },
  autoApply: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ClearanceGroup = mongoose.models.ClearanceGroup || mongoose.model("ClearanceGroup", clearanceGroupSchema);
export default ClearanceGroup;
