import express from "express";
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  activateBanner,
  deactivateBanner,
  getPublicBanners,
} from "../controllers/bannerController.js";

import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const bannerRouter = express.Router();

// Public routes
bannerRouter.get("/public", getPublicBanners);

// Admin routes
bannerRouter.get("/", authUser, getAllBanners);
bannerRouter.get("/:id", authUser, getBannerById);
bannerRouter.post("/", authUser, adminAuth, createBanner);
bannerRouter.put("/:id", authUser, adminAuth, updateBanner);
bannerRouter.delete("/:id", authUser, adminAuth, deleteBanner);
bannerRouter.put("/:id/activate", authUser, adminAuth, activateBanner);
bannerRouter.put("/:id/deactivate", authUser, adminAuth, deactivateBanner);

export default bannerRouter;
