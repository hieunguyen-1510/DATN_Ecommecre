import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import ReviewProduct from "../components/ReviewProduct";
import { FaStar, FaCheck } from "react-icons/fa";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setMainImage(product.image[0]);
      document.title = `Street Style - ${product.name}`;
    } else {
      // console.error("Không tìm thấy sản phẩm với ID:", productId);
      setProductData(null);
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
      // Đồng bộ nền và padding với các section khác
      className="min-h-screen bg-gray-50 py-16"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Đồng bộ padding ngang */}
        <div className="flex flex-col-reverse lg:flex-row lg:gap-16 gap-8">
          {/* Product Images */}
          <motion.div
            variants={sectionVariants}
            className="flex-1 flex flex-col-reverse lg:flex-row lg:gap-8 h-full"
          >
            {/* Thumbnail Images */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-scroll justify-start lg:w-[18%] w-full gap-4 lg:gap-0">
              {" "}
              {productData.image.map((img, index) => (
                <img
                  key={index}
                  src={
                    img ||
                    "https://placehold.co/100x133/E0E0E0/6C6C6C?text=No+Image"
                  } // Placeholder cho thumbnail
                  alt={`${productData.name} - ${index + 1}`}
                  className={`w-24 h-32 object-cover rounded-xl shadow-md cursor-pointer mb-4 lg:mb-4 flex-shrink-0 
                              ${
                                mainImage === img
                                  ? "border-4 border-yellow-500 scale-105"
                                  : "border-2 border-gray-200 hover:border-yellow-300"
                              } 
                              transition-all duration-200`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
            {/* Main Product Image */}
            <div className="w-full lg:w-[80%] h-full aspect-[3/4]">
              <motion.img
                whileHover={{ scale: 1.02 }}
                src={
                  mainImage ||
                  "https://placehold.co/600x800/E0E0E0/6C6C6C?text=No+Image"
                } // Placeholder cho ảnh chính
                alt={productData.name}
                className="w-full h-full object-cover rounded-2xl shadow-xl"
                style={{ maxHeight: "600px" }}
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={sectionVariants}
            // Đồng bộ padding, bo góc, bóng và khoảng cách giữa các phần
            className="flex-1 bg-white p-8 rounded-2xl shadow-xl space-y-6"
          >
            {/* Product Title */}
            <h1 className="font-black text-2xl text-gray-900 leading-tight">
              {" "}
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              {" "}
              {/* Tăng gap */}
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                ))}
              </div>
              <span className="text-gray-700 text-sm font-medium">
                (122 đánh giá)
              </span>{" "}
            </div>

            {/* Price */}
            <p className="text-2xl font-black text-orange-500">
              {" "}
              {productData.price.toLocaleString("vi-VN")} {currency}
            </p>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed text-base">
              {" "}
              {/* Đổi màu, tăng line-height, kích thước */}
              {productData.description ||
                "Áo thun oversize giặt acid loang jổ, như bức tranh đường phố sống động. Thoải mái, nổi loạn - chuẩn gu Việt!"}
            </p>

            {/* Size Selection */}
            <div className="pt-4">
              <h3 className="font-bold text-gray-900 text-base mb-4">
                Chọn kích cỡ
              </h3>{" "}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
                {" "}
                {productData.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-2 rounded-lg border-2 text-base font-semibold transition-all duration-200 
                    ${
                      selectedSize === size
                        ? "border-yellow-500 bg-yellow-100 text-yellow-800 shadow-md"
                        : "border-gray-300 text-gray-700 hover:border-yellow-400 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
              }} // Hiệu ứng hover
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-full uppercase tracking-wide text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none" // Đồng bộ style nút
              onClick={() => addToCart(productData._id, selectedSize)}
              disabled={!selectedSize}
            >
              THÊM VÀO GIỎ
            </motion.button>

            {/* Product Guarantees */}
            <div className="space-y-3 pt-6">
              {" "}
              <div className="flex items-center gap-3 text-gray-700 text-base font-medium">
                {" "}
                <FaCheck className="w-6 h-6 text-green-600" />{" "}
                <span>100% Sản phẩm chính hãng</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 text-base font-medium">
                <FaCheck className="w-6 h-6 text-green-600" />
                <span>Hỗ trợ thanh toán khi nhận hàng</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 text-base font-medium">
                <FaCheck className="w-6 h-6 text-green-600" />
                <span>Đổi trả dễ dàng trong vòng 7 ngày</span>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Product Details Tabs */}
        <motion.div
          variants={sectionVariants}
          // Đồng bộ bo góc, bóng và padding
          className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {" "}
            <button
              className={`px-8 py-4 font-semibold text-lg transition-colors duration-200 ${
                activeTab === "description"
                  ? "text-yellow-600 border-b-2 border-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`px-8 py-4 font-semibold text-lg transition-colors duration-200 ${
                activeTab === "reviews"
                  ? "text-yellow-600 border-b-2 border-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
          </div>

          <div className="p-8 text-gray-700 leading-relaxed space-y-5">
            {" "}
            {/* Tăng padding, line-height, space-y */}
            {activeTab === "description" ? (
              <div className="space-y-4">
                <p>{productData.description}</p>
                <p>
                  Được làm từ chất liệu cao cấp, đảm bảo độ bền và sự thoải mái.
                  Thiết kế mang đậm phong cách đường phố Việt Nam.
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  {" "}
                  {/* Tăng pl và space-y */}
                  <li>Chất liệu: {productData.material || "Cotton 100%"}</li>
                  <li>Kiểu dáng: {productData.style || "Oversize"}</li>
                  <li>Phong cách: {productData.type || "Streetwear"}</li>
                  <li>Màu sắc: {productData.colors || "Đa dạng"}</li>
                </ul>
              </div>
            ) : (
              <ReviewProduct productId={productId} />
            )}
          </div>
        </motion.div>
        {/* Related Products  */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </motion.div>
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {" "}
      {/* Đồng bộ nền */}
      <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm</p>
    </div>
  );
};

export default Product;
