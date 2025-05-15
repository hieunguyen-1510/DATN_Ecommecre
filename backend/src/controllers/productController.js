import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller, stock, status } = req.body;
    const images = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files?.[key]?.[0])
      .filter((item) => item !== undefined);

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
          return result.secure_url;
        })
      );
    }

    const product = new productModel({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: sizes ? JSON.parse(sizes) : [],
      image: imagesUrl,
      stock: Number(stock) || 0,
      status: status || "active",
    });

    await product.save();
    res.json({ success: true, message: "Sản phẩm đã được thêm!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Danh sách sản phẩm
const listProducts = async (req, res) => {
  try {
    console.log("Token từ API:", req.headers.authorization);

    const { search = "" } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    // **Hiển thị toàn bộ sản phẩm** cho cả admin và user
    const products = await productModel.find(query);

    res.json({ success: true, products, total: products.length });
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
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, subCategory, sizes, bestseller, stock, status } = req.body;
    const images = ["image1", "image2", "image3", "image4"]
      .map((key) => req.files?.[key]?.[0])
      .filter((item) => item !== undefined);

    let imagesUrl = [];
    if (images.length > 0) {
      // Xóa hình ảnh cũ
      const product = await productModel.findById(id);
      if (product.image.length > 0) {
        await Promise.all(product.image.map(async (url) => {
          const publicId = url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }));
      }

      imagesUrl = await Promise.all(images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      }));
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: Array.isArray(sizes) ? sizes : [],
      stock: Number(stock) || 0,
      status: status || "active",
      ...(imagesUrl.length > 0 && { image: imagesUrl }),
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    res.json({ success: true, message: "Sản phẩm đã được cập nhật!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, removeProduct, listProducts, singleProduct, updateProduct };
