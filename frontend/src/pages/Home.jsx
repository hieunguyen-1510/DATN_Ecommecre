import React from "react";
import HeroSection from "../components/HeroSection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import LatestCollection from "../components/LatestCollection";
import NewsLetterBox from "../components/NewsLetterBox";
import Category from "../components/Category";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Phần mở đầu */}
      <HeroSection />
      {/* Phần danh mục hình ảnh */}
      <section className="py-16 bg-gray-100">
        <Category />
      </section>

      {/* Sản phẩm bán chạy */}
      <section className="py-16 bg-white">
        <BestSeller />
      </section>

      {/* Bộ sưu tập mới nhất */}
      <section className="py-16 bg-white">
        <LatestCollection />
      </section>

      {/* Chính sách của chúng tôi */}
      <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
        <OurPolicy />
      </section>

      {/* Hộp đăng ký nhận thông tin */}
      <section className="py-16 bg-white">
        <NewsLetterBox />
      </section>
    </div>
  );
};

export default Home;