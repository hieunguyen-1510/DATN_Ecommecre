import React, { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const About = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [messageType, setMessageType] = useState(""); 

    // Animation variants
    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    // Variants for individual items to stagger animation
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const stats = [
        { value: "5,000+", label: "Khách hàng hài lòng" },
        { value: "100+", label: "Thiết kế độc quyền" },
        { value: "24/7", label: "Hỗ trợ trực tuyến" },
    ];

    const coreValues = [
        {
            title: "Sáng Tạo",
            icon: "💡",
            img: assets.creative_img || "image_7ba453.png", 
            desc: "Đột phá với các thiết kế streetwear độc nhất",
            alt: "Hình ảnh thể hiện sự sáng tạo với các ý tưởng và dụng cụ thiết kế"
        },
        {
            title: "Chất Lượng",
            icon: "✨",
            img: assets.quality_img || "image_71bb30.png",
            desc: "Vải cao cấp - Đường may tỉ mỉ",
            alt: "Biểu tượng 100% chất lượng cao với vòng nguyệt quế vàng"
        },
        {
            title: "Cộng Đồng",
            icon: "👥",
            img: assets.community_img || "image_71bdfc.jpg",
            desc: "Lan tỏa văn hóa đường phố Việt",
            alt: "Hình ảnh nhóm người đa dạng tượng trưng cho cộng đồng"
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // Simulate API call or form submission
            console.log("Submitting email:", email);
            setIsSubmitted(true);
            setSubmitMessage("Cảm ơn bạn đã đăng ký! Ưu đãi sẽ được gửi đến email của bạn.");
            setMessageType("success");
            setEmail(""); 
            
            // Reset form and message after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setSubmitMessage("");
                setMessageType("");
            }, 3000);
        } else {
            setSubmitMessage("Vui lòng nhập địa chỉ email của bạn.");
            setMessageType("error");
            setTimeout(() => {
                setSubmitMessage("");
                setMessageType("");
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* ===== Breadcrumbs ===== */}
            <nav className="bg-gray-50 py-3 px-4">
                <div className="container max-w-7xl mx-auto text-sm">
                    <Link to="/" className="text-gray-600 hover:text-red-600">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-red-600 font-medium">Giới thiệu</span>
                </div>
            </nav>

            {/* ===== Hero Section ===== */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative h-[28rem] bg-cover bg-center flex items-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${assets.about_hero || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"})`,
                }}
            >
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-md"
                    >
                        Street Style – Định Nghĩa Phong Cách Đường Phố
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            to="/collection"
                            className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Khám phá bộ sưu tập →
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* ===== Stats Bar ===== */}
            <div className="bg-gray-900 text-white py-8">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-3xl font-bold text-red-600 mb-2">{stat.value}</p>
                                <p className="text-gray-300">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== Our Story ===== */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="py-14 bg-gray-50"
            >
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div variants={itemVariants} className="order-2 lg:order-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                <span className="text-red-600">Câu Chuyện</span> Của Chúng Tôi
                            </h2>

                            <p className="text-base text-gray-700 mb-4 leading-relaxed">
                                Năm 2020, từ một cửa hàng nhỏ tại Sài Gòn, Street Style ra đời với sứ mệnh mang
                                <strong> văn hóa đường phố Việt Nam</strong> đến với thế giới. Chúng tôi tin rằng thời trang
                                không chỉ là quần áo, mà là cách bạn kể câu chuyện của chính mình.
                            </p>

                            <p className="text-base text-gray-700 mb-6 leading-relaxed">
                                Đến nay, chúng tôi tự hào đã đồng hành cùng hơn <strong>5,000 khách hàng</strong>,
                                mang đến những trải nghiệm mua sắm khác biệt với chất lượng từng đường kim mũi chỉ.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/about" 
                                    className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg" // Added duration and shadow
                                >
                                    Xem thêm
                                </Link>
                                <Link
                                    to="/contact"
                                    className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg" // Added duration and shadow
                                >
                                    Liên hệ
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="order-1 lg:order-2 relative">
                            {/* Optional: Add a loading state / skeleton for the image */}
                            <img
                                src={assets.story_img || "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"}
                                alt="Hình ảnh cửa hàng Street Style với các mẫu quần áo treo trên giá" 
                                className="w-full h-auto rounded-xl shadow-xl"
                                loading="lazy" // Added lazy loading
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* ===== Mission ===== */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="py-14 bg-white"
            >
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div variants={itemVariants} className="relative">
                            <img
                                src={assets.mission_img || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
                                alt="Bảng đen với hình ảnh bóng đèn và chữ 'Our Mission'" 
                                className="w-full h-auto rounded-xl shadow-xl"
                                loading="lazy" // Added lazy loading
                            />
                            <div className="absolute -bottom-6 -right-6 bg-red-600 text-white py-3 px-6 rounded-lg shadow-lg">
                                <p className="font-bold">Since 2020</p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                <span className="text-red-600">Sứ Mệnh</span> & Tầm Nhìn
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-red-100 p-2 rounded-full mr-4">
                                        <span className="text-red-600 text-xl">🎯</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Sứ Mệnh</h3>
                                        <p className="text-gray-700">
                                            Truyền cảm hứng để bạn tự tin thể hiện cá tính thông qua phong cách streetwear đậm chất Việt.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-red-100 p-2 rounded-full mr-4">
                                        <span className="text-red-600 text-xl">👁️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Tầm Nhìn</h3>
                                        <p className="text-gray-700">
                                            Trở thành thương hiệu streetwear hàng đầu Đông Nam Á, góp phần quảng bá văn hóa Việt ra thế giới.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* ===== Core Values ===== */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="py-14 bg-gray-50"
            >
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Giá Trị <span className="text-red-600">Cốt Lõi</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Những nguyên tắc không thỏa hiệp trong từng sản phẩm chúng tôi tạo ra
                        </p>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } } // Stagger children for animation
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {coreValues.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants} // Apply item animation variant
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                            >
                                <div className="aspect-w-16 aspect-h-9 w-full h-48 overflow-hidden"> {/* Adjusted to set fixed height */}
                                    <img
                                        src={item.img}
                                        alt={item.alt} // Use descriptive alt text from coreValues data
                                        className="w-full h-full object-cover" // Ensure image covers the div
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <span className="text-2xl mr-3">{item.icon}</span>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ===== CTA Section ===== */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-center"
            >
                <div className="container max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6"> {/* Increased font size slightly */}
                        Sẵn sàng <span className="text-red-400">thay đổi</span> phong cách?
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg"> {/* Increased font size slightly */}
                        Đăng ký nhận ngay ưu đãi 10% cho đơn hàng đầu tiên
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full font-medium transition-all hover:scale-105"
                        >
                            Đăng ký ngay
                        </button>
                    </form>

                    {isSubmitted && submitMessage && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}
                        >
                            {submitMessage}
                        </motion.p>
                    )}
                    {!isSubmitted && ( 
                        <p className="text-gray-400 text-sm mt-4">
                            Chúng tôi cam kết không spam email của bạn
                        </p>
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default About;