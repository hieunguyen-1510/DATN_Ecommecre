import React from 'react';
import Slider from 'react-slick';
import { assets } from '../assets/assets'; 
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Hiệu ứng cho nội dung banner
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const CustomArrow = ({ style, onClick, direction }) => {
  return (
    <motion.div
      className={`absolute top-1/2 transform -translate-y-1/2 ${
        direction === "left" ? "left-4" : "right-4"
      } flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out`}
      style={{ ...style, zIndex: 1 }}
      onClick={onClick}
      whileHover={{
        scale: 1.3,
        rotate: direction === "left" ? -15 : 15,
        boxShadow: "0px 0px 10px rgba(236, 72, 153, 0.5)",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {direction === "left" ? (
        <AiOutlineLeft className="text-orange-400 text-3xl drop-shadow-lg hover:text-pink-500" />
      ) : (
        <AiOutlineRight className="text-orange-400 text-3xl drop-shadow-lg hover:text-pink-500" />
      )}
    </motion.div>
  );
};

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };

  const defaultBanners = [
    {
      image: "https://via.placeholder.com/1200x600?text=Default+Banner",
      title: "Thể Hiện Phong Cách",
      highlight: "",
      subtitle: "Khám phá ngay!",
    },
  ];

  // Dữ liệu banners
  const banners = [
    {
      image: assets?.banner1 || defaultBanners[0].image,
      title: "Thể Hiện Phong Cách Đường Phố",
      highlight: "",
      subtitle: "Khám phá bộ sưu tập mới nhất lấy cảm hứng từ nhịp sống đô thị Việt Nam",
    },
    {
      image: assets?.banner2 || defaultBanners[0].image,
      title: "Mùa Hè Ưu Đãi Lớn",
      highlight: "50% OFF",
      subtitle: "Cơ hội giảm giá lên đến 50% cho các sản phẩm được chọn",
    },
    {
      image: assets?.banner3 || defaultBanners[0].image,
      title: "Thể Hiện Phong Cách Cá Nhân",
      highlight: "",
      subtitle: "Hãy táo bạo và là chính bạn với bộ sưu tập độc đáo của chúng tôi",
    },
  ];

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {Array.isArray(banners) && banners.length > 0 ? (
          banners.map((banner, index) => (
            <div key={index}>
              <div
                className="relative h-[60vh] min-h-[400px] bg-cover bg-center"
                style={{
                  backgroundImage: banner.image ? `url(${banner.image})` : "none",
                  backgroundColor: banner.image ? "transparent" : "#f0f0f0",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-6 md:px-12">
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white">
                      {banner.title}
                      {banner.highlight && (
                        <span className="text-orange-400"> {banner.highlight}</span>
                      )}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-100 mt-4 max-w-2xl">
                      {banner.subtitle}
                    </p>
                    <motion.div
                      className="mt-6"
                      whileHover={{
                        scale: 1.1,
                        background: "linear-gradient(90deg, #fb923c, #ec4899)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        to="/collection"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-transform"
                      >
                        Shop Now
                        <AiOutlineRight className="ml-2" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-[60vh] min-h-[400px] flex items-center justify-center bg-gray-200">
            <p className="text-gray-600 text-lg">Không có banner để hiển thị</p>
          </div>
        )}
      </Slider>
    </div>
  );
};

export default HeroSection;