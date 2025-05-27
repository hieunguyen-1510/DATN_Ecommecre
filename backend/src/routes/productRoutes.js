import express from 'express';
import { addProduct, removeProduct, listProducts, singleProduct, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
import authAccess from '../middleware/authAccess.js';

const productRouter = express.Router();

// Thêm sản phẩm
productRouter.post(
  '/add',
  authUser,
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Cập nhật sản phẩm
productRouter.put(
  '/update/:id',
  authUser,
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

// Xóa sản phẩm
productRouter.delete('/:id',authUser,adminAuth, removeProduct);

// Lấy danh sách sản phẩm
productRouter.get('/list',authUser,authAccess,listProducts);

// Lấy chi tiết sản phẩm
productRouter.get('/:id',authUser,authAccess,singleProduct);

export default productRouter;