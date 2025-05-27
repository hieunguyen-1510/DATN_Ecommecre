import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendUrl}/api/banners/public`);
        setBanners(res.data);
      } catch (err) {
        setError("Không thể tải banner. Vui lòng thử lại sau.");
        console.error("Error fetching public banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Cấu hình slider react-slick
  const settings = {
    dots: true, // Hiển thị chấm tròn chuyển slide
    arrows: true, // Hiển thị mũi tên chuyển slide
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Chỉ hiện 1 banner/lần
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Đang tải banner...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        Chưa có banner nào được kích hoạt.
      </div>
    );
  }

  return (
    <div className="w-full">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className="relative h-[600px]">
            <img
              src={banner.imageUrl}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
