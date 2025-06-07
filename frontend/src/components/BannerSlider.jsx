import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendUrl}/api/banners/public`);
        const validBanners = res.data.filter((banner) => banner.imageUrl);
        setBanners(validBanners);
      } catch (err) {
        setError("Không thể tải banner. Vui lòng thử lại sau.");
        console.error("Error fetching public banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="animate-pulse">Đang tải banner...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Thử lại
        </button>
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
    <div className="w-full overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className="relative">
            <div className="w-full h-[400px] md:h-[500px] lg:h-[630px] relative">
              <img
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
