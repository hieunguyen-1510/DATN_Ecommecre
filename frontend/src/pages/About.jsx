import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const About = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700">
      {/* Mục tiêu */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.about_img})` }}
      >
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col items-center justify-center text-center">
          <div className="container max-w-7xl mx-auto px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg bebas-neue">
              Street Style – Định nghĩa thời trang đường phố Việt Nam
            </h1>
            <p className="text-md md:text-lg text-gray-200 mt-2">
              Chúng tôi mang đến phong cách thời trang đường phố độc đáo và táo bạo.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Câu chuyện của chúng tôi */}
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6 bebas-neue">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Street Style ra đời từ niềm đam mê với văn hóa đường phố Việt Nam. Chúng tôi mong muốn đưa thời trang đường phố đến gần hơn với giới trẻ bằng những thiết kế mang đậm dấu ấn cá nhân và chất lượng cao.
          </p>
        </div>
      </motion.div>

      {/* Sứ mệnh */}
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-24 bg-gray-100">
        <div className="container max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6 bebas-neue">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Chúng tôi tin rằng thời trang không chỉ là quần áo, mà là cách thể hiện bản thân. Sứ mệnh của chúng tôi là truyền cảm hứng để bạn tự tin sống đúng với cá tính của mình.
          </p>
        </div>
      </motion.div>

      {/* Giá trị cốt lõi */}
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-black text-center mb-12 bebas-neue">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-2">Sáng tạo</h3>
              <p className="text-gray-600">Chúng tôi không ngừng đổi mới trong thiết kế để bắt kịp xu hướng và tạo dấu ấn riêng biệt.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng</h3>
              <p className="text-gray-600">Từng sản phẩm đều được lựa chọn kỹ lưỡng từ chất liệu đến từng đường may.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Cộng đồng</h3>
              <p className="text-gray-600">Chúng tôi xây dựng một cộng đồng những người yêu thích thời trang và phong cách sống tự do.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kêu gọi hành động */}
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-24 bg-gradient-to-r from-gray-100 to-gray-200 text-center">
        <div className="container max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-black mb-4 bebas-neue">Gia nhập cộng đồng Street Style ngay hôm nay!</h2>
          <p className="text-gray-600 mb-6">Khám phá những bộ sưu tập mới nhất và định hình phong cách riêng của bạn.</p>
          <Link to="/collection" className="inline-block px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">
            Xem tất cả bộ sưu tập
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
