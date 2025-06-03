import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      stock,
      status,
      purchasePrice,
    } = req.body;
    const images = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files?.[key]?.[0])
      .filter((item) => item !== undefined);

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const product = new productModel({
      name,
      description,
      price: Number(price),
      purchasePrice: Number(purchasePrice),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: sizes ? JSON.parse(sizes) : [],
      image: imagesUrl,
      stock: Number(stock) || 0,
      status: status || "active",
      finalPrice: Number(price), // Khởi tạo finalPrice bằng price
    });

    await product.save();
    res.json({ success: true, message: "Sản phẩm đã được thêm!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      purchasePrice,
      category,
      subCategory,
      sizes,
      bestseller,
      stock,
      status,
    } = req.body;

    const images = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files?.[key]?.[0])
      .filter(Boolean);

    let imagesUrl = [];
    if (images.length > 0) {
      const product = await productModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm không tồn tại",
        });
      }

      if (product.image && product.image.length > 0) {
        await Promise.all(
          product.image.map(async (url) => {
            const publicId = url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          })
        );
      }

      imagesUrl = await Promise.all(
        images.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const updateData = {
      name,
      description,
      price: Number(price),
      purchasePrice: Number(purchasePrice),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: sizes ? JSON.parse(sizes) : [],
      stock: Number(stock) || 0,
      status: status || "active",
    };

    if (imagesUrl.length > 0) {
      updateData.image = imagesUrl;
    }

    // Cập nhật finalPrice nếu không có giảm giá
    if (!updateData.discountPercentage && !updateData.discountAmount) {
      updateData.finalPrice = Number(price);
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    res.json({
      success: true,
      message: "Sản phẩm đã được cập nhật!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Danh sách sản phẩm
const listProducts = async (req, res) => {
  try {
    const { search = "", category = "", sortBy = "" } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    // Xử lý guest và user/admin
    if (!req.user || (req.user && req.user.role !== "admin")) {
      query.status = "active";
    } else if (req.user && req.user.role === "admin") {
      if (req.query.status) {
        query.status = req.query.status;
      }
    }

    let sortOptions = {};
    if (sortBy === "priceAsc") {
      sortOptions.finalPrice = 1; 
    } else if (sortBy === "priceDesc") {
      sortOptions.finalPrice = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await productModel
      .find(query)
      .sort(sortOptions)
      .select("-__v"); 

    const productList = products.map((product) => ({
      ...product.toObject(),
      purchasePrice:
        req.user && req.user.role === "admin"
          ? product.purchasePrice || null
          : undefined,
      // Bao gồm các trường giảm giá
      discountPercentage: product.discountPercentage || null,
      discountAmount: product.discountAmount || null,
      discountCode: product.discountCode || null,
      finalPrice: product.finalPrice || product.price,
    }));

    res.json({ success: true, products: productList, total: products.length });
  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    // Xóa hình ảnh trên Cloudinary
    await Promise.all(product.image.map(async (url) => {
      const publicId = url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }));

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Sản phẩm đã được xóa!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin sản phẩm
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    if (!req.user || req.user.role !== "admin") {
      product = await productModel
        .findOne({ _id: id, status: "active" })
        .select("-__v");
    } else {
      product = await productModel.findById(id).select("-__v");
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    const productData = {
      ...product.toObject(),
      purchasePrice:
        req.user && req.user.role === "admin"
          ? product.purchasePrice || null
          : undefined,
      discountPercentage: product.discountPercentage || null,
      discountAmount: product.discountAmount || null,
      discountCode: product.discountCode || null,
      finalPrice: product.finalPrice || product.price,
    };

    res.json({ success: true, product: productData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addProduct, removeProduct, listProducts, singleProduct, updateProduct };