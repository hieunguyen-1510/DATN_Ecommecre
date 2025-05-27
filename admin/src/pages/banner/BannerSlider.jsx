import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      setError("");
      try {
        // Gọi API
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

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

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
      <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-lg flex items-center justify-center bg-gray-200 text-gray-500">
        <p>Chưa có banner nào được kích hoạt.</p>
      </div>
    );
  }

  const banner = banners[index];

  const next = () => setIndex((i) => (i + 1) % banners.length);
  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-lg">
      <img
        src={banner.imageUrl}
        alt="Banner Image"
        className="w-full h-full object-cover"
      />

      <button
        onClick={prev}
        aria-label="Previous Banner"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        {"<"}
      </button>
      <button
        onClick={next}
        aria-label="Next Banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center"
      >
        {">"}
      </button>
    </div>
  );
}

export default BannerSlider;
