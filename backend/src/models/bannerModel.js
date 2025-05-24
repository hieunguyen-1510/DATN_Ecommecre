import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true, trim: true },
  targetUrl: { type: String, trim: true },
  position: { type: String, required: true, trim: true }, 
  order: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: false },
  startDate: Date,
  endDate: Date,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Banner =  mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
export default Banner;
