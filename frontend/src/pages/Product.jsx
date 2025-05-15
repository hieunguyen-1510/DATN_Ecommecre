import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ReviewProduct from '../components/ReviewProduct';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [selectedStar, setSelectedStar] = useState(0);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
      document.title = `Street Style - ${product.name}`;
    }
  }, [productId, products]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return productData ? (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-100 py-24"
    >
      <div className="container max-w-7xl mx-auto px-8">
        <div className="flex flex-col-reverse lg:flex-row lg:gap-16 gap-8">
          {/* Ảnh */}
          <motion.div
            variants={sectionVariants}
            className="flex-1 flex flex-col-reverse lg:flex-row lg:gap-8"
          >
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-scroll justify-between lg:w-[18%] w-full">
              {productData.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={productData.name}
                  className="w-[30%] lg:w-full flex-shrink-0 rounded-lg shadow-md cursor-pointer mb-4 lg:mb-0"
                  onClick={() => setImage(img)}
                />
              ))}
            </div>
            <div className="w-full lg:w-[80%]">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={image}
                alt={productData.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* Thông tin */}
          <motion.div
            variants={sectionVariants}
            className="flex-1 bg-white p-6 rounded-lg shadow-lg"
          >
            <h1 className="font-bold text-3xl mt-2 bebas-neue text-black">{productData.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(4)].map((_, i) => (
                <img key={i} src={assets.star_icon} alt="Star" className="w-4" />
              ))}
              <img src={assets.star_dull_icon} alt="Star" className="w-4" />
              <p className="pl-2 text-gray-600">(122 đánh giá)</p>
            </div>
            <p className="mt-5 text-3xl font-medium text-red-500">
              {productData.price.toLocaleString('vi-VN')} {currency}
            </p>
            <p className="mt-5 text-gray-600 md:w-4/5">{productData.description}</p>
            <div className="flex flex-col gap-4 my-8">
              <p className="text-gray-700">Chọn kích cỡ</p>
              <div className="flex gap-3">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    className={`border py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-red-200 hover:to-red-500 ${
                      item === size ? 'border-red-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 hover:scale-105 transition transform"
              onClick={() => addToCart(productData._id, size)}
            >
              THÊM VÀO GIỎ
            </button>
            <hr className="mt-8 lg:w-4/5 border-gray-200" />
            <div className="text-sm text-gray-600 flex flex-col gap-1 mt-5">
              <p>100% Sản phẩm chính hãng</p>
              <p>Hỗ trợ thanh toán khi nhận hàng</p>
              <p>Đổi/trả dễ dàng trong vòng 7 ngày</p>
            </div>
          </motion.div>
        </div>

        {/* Mô tả chi tiết */}
        <motion.div
          variants={sectionVariants}
          className="mt-20 bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-lg"
        >
          <div className="flex">
            <b className="border px-5 py-3 bg-red-500 text-white rounded-tl-lg rounded-tr-lg">Mô tả</b>
            <p className="border px-5 py-3 bg-gray-100 text-gray-600">Đánh giá (122)</p>
          </div>
          <div className="flex flex-col gap-4 border border-gray-200 px-6 py-6 bg-white rounded-bl-lg rounded-br-lg">
            <p>{productData.description}</p>
            <p>Được làm từ chất liệu cao cấp, đảm bảo độ bền và sự thoải mái. Thiết kế mang đậm phong cách đường phố Việt Nam.</p>
          </div>
        </motion.div>

        {/* Form đánh giá */}
        <ReviewProduct productId={productId} />

        {/* Sản phẩm liên quan */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </motion.div>
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm</p>
    </div>
  );
};

export default Product;
