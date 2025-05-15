import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportType: { type: String, enum: ["sales", "inventory", "orders"], required: true },
  data: { type: Object, required: true },
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
export default Report;
