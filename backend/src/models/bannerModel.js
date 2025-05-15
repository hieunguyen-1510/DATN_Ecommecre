import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true, 
  },
  link: {
    type: String,
    required: false, 
  },
  isActive: {
    type: Boolean,
    default: true, // true = hiển thị, false = ẩn
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;
