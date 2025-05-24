import React from "react";
import Slider from "react-slick";
import { assets } from "../assets/assets";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const HeroSection = () => {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <div className="slick-prev" />,
    nextArrow: <div className="slick-next" />,
  };

  const defaultBanners = [
    {
      image: "https://via.placeholder.com/1200x600?text=Default+Banner",
      title: "Express Your Style",
      highlight: "",
      subtitle: "Shop Now!",
    },
  ];

  const banners = [
    {
      image: assets?.banner3 || defaultBanners[0].image,
      title: "STREET STYLE VIBE",
      highlight: "",
      subtitle: "EXPLORE THE TREND",
      cta: "SHOP NOW →",
      textPosition: "left",
      textColor: "text-white",
      bgColor: "bg-gradient-to-r from-black/60 to-transparent",
      titleFont: "font-dancing font-bold text-5xl uppercase tracking-widest mb-4",
      highlightFont: "",
      subtitleFont: "text-xl tracking-wider mb-8",
      ctaStyle:
        "bg-white hover:bg-amber-100 text-black font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg",
      spacing: "flex flex-col items-start justify-center h-full ml-8 md:ml-16",
    },
    {
      image: assets?.banner2 || defaultBanners[0].image,
      title: "SUMMER SALE",
      highlight: "30% OFF",
      subtitle: "LIMITED TIME OFFER - ENDS SOON",
      cta: "SHOP NOW →",
      textPosition: "center",
      textColor: "text-white",
      bgColor: "bg-gradient-to-b from-black/60 to-black/30",
      titleFont: "font-dancing font-bold text-5xl uppercase tracking-widest mb-2",
      highlightFont: "font-black text-7xl my-6 text-amber-400",
      subtitleFont: "text-xl tracking-wider mb-8",
      ctaStyle:
        "bg-white hover:bg-amber-100 text-black font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg",
      spacing: "flex flex-col items-center justify-center h-full",
    },
    {
      image: assets?.banner4 || defaultBanners[0].image,
      title: "BE UNIQUE",
      highlight: "",
      subtitle: "SHOW YOUR EDGE",
      cta: "DISCOVER MORE →",
      textPosition: "right",
      textColor: "text-white",
      bgColor: "bg-gradient-to-l from-black/60 to-transparent",
      titleFont: "font-dancing font-bold text-5xl uppercase tracking-widest mb-4",
      highlightFont: "",
      subtitleFont: "text-xl tracking-wider mb-8",
      ctaStyle:
        "bg-white hover:bg-amber-100 text-black font-bold py-3 px-8 rounded-full text-lg transition-all shadow-lg",
      spacing: "flex flex-col items-end justify-center h-full mr-8 md:mr-16",
    },
  ];

  return (
    <div className="w-full relative">
      <style>
        {`
          .slick-prev, .slick-next {
            width: 40px;
            height: 40px;
            z-index: 10;
          }
          .slick-prev:before, .slick-next:before {
            font-size: 40px;
            color: white;
            opacity: 0.8;
            transition: all 0.3s ease;
          }
          .slick-prev:hover:before, .slick-next:hover:before {
            color: #000;
            opacity: 1;
          }
          .slick-prev {
            left: 25px;
          }
          .slick-next {
            right: 25px;
          }
        `}
      </style>
      <Slider {...settings}>
        {Array.isArray(banners) && banners.length > 0 ? (
          banners.map((banner, index) => (
            <div key={index}>
              <div
                className="relative h-[80vh] min-h-[500px] bg-cover bg-center"
                style={{
                  backgroundImage: banner.image
                    ? `url(${banner.image})`
                    : "none",
                  backgroundColor: banner.image ? "transparent" : "#f0f0f0",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${banner.bgColor}`}></div>

                {/* Content Container */}
                <div
                  className={`relative ${banner.spacing} ${
                    banner.textPosition === "center"
                      ? "text-center"
                      : banner.textPosition === "right"
                      ? "text-right"
                      : "text-left"
                  } px-4`}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className={`${banner.textColor} max-w-2xl`}
                  >
                    <h1 className={`${banner.titleFont} font-dancing`}>
                      {banner.title}
                      {banner.highlight && (
                        <span className={`${banner.highlightFont}`}>
                          {" "}
                          {banner.highlight}
                        </span>
                      )}
                    </h1>
                    <p className={`${banner.subtitleFont}`}>
                      {banner.subtitle}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8"
                    >
                      <Link to="/collection" className={`${banner.ctaStyle}`}>
                        {banner.cta}
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-[50vh] min-h-[350px] flex items-center justify-center bg-gray-200">
            <p className="text-gray-600 text-lg">No banners to display</p>
          </div>
        )}
      </Slider>
    </div>
  );
};

export default HeroSection;
