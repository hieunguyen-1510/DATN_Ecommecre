import Banner from "../models/bannerModel.js";
import validator from "validator";

// GET all banners
export const getAllBanners = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const filter = {};

    // Lọc theo trạng thái active
    if (active !== undefined) filter.active = active === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const banners = await Banner.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBanners = await Banner.countDocuments(filter);

    res.status(200).json({
      data: banners,
      pagination: {
        total: totalBanners,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBanners / limit),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Cannot fetch banners", details: err.message });
  }
};

// GET banner by ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Cannot fetch banner", details: err.message });
  }
};

// POST create banner
export const createBanner = async (req, res) => {
  try {
    const { imageUrl, active } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required." });
    }
    if (!validator.isURL(imageUrl)) {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    const newBanner = new Banner({
      imageUrl,
      active,
    });
    const savedBanner = await newBanner.save();

    res.status(201).json(savedBanner);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Cannot create banner", details: err.message });
  }
};

// PUT update banner
export const updateBanner = async (req, res) => {
  try {
    const { imageUrl, active } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required." });
    }
    if (!validator.isURL(imageUrl)) {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        imageUrl,
        active,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(updatedBanner);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Cannot update banner", details: err.message });
  }
};

// DELETE banner
export const deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Cannot delete banner", details: err.message });
  }
};

// PUT activate banner
export const activateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.active = true; 
    const savedBanner = await banner.save();

    res.json({ message: "Banner activated", banner: savedBanner });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Cannot activate banner", details: err.message });
  }
};

// PUT deactivate banner
export const deactivateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found!" });

    banner.active = false;
    await banner.save();

    res.status(200).json({ message: "Banner deactivated!", banner: banner });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Cannot deactivate banner!", details: err.message });
  }
};

// GET public banners
export const getPublicBanners = async (req, res) => {
  try {
    const filter = { active: true };

    const banners = await Banner.find(filter)
      .sort({ created_at: -1 })
      .limit(10);

    res.status(200).json(banners);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Cannot fetch public banners", details: err.message });
  }
};
