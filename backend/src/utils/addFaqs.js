import mongoose from "mongoose";
import FAQ from "../models/faqsModel.js";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI;

if (!dbURI) {
    console.error("Error: MONGO_URI is not defined in .env file. Please check your .env file.");
    process.exit(1);
}

mongoose.connect(dbURI)

.then(async () => {
    console.log("Connected to MongoDB!");
    try {
        await FAQ.deleteMany({}); // xoa du lieu cu

         const faqsData = [
            {
                question: "Cửa hàng có những phương thức thanh toán nào?",
                answer: "Street Style chấp nhận thanh toán qua ngân hàng (VNPAY), thanh toán qua ví điện tử (MOMO) và thanh toán khi nhận hàng (COD).",
                keywords: ["thanh toán", "phương thức", "COD", "MOMO", "VNPAY", "trả tiền"]
            },
            {
                question: "Chính sách đổi trả của cửa hàng như thế nào?",
                answer: "Cửa hàng Street Style chấp nhận đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tag, chưa qua sử dụng và có hóa đơn mua hàng. Vui lòng liên hệ bộ phận chăm sóc khách hàng để được hướng dẫn chi tiết.",
                // Các từ khóa liên quan đến "đổi trả"
                keywords: ["đổi trả", "chính sách đổi trả", "đổi hàng", "trả hàng", "đổi sản phẩm", "điều kiện đổi trả", "quy định đổi trả"]
            },
            {
                question: "Chính sách hoàn tiền của cửa hàng là gì?",
                answer: "Street Style cam kết hoàn tiền trong vòng 7 ngày nếu sản phẩm lỗi từ nhà sản xuất hoặc không đúng mô tả, với quy trình minh bạch. Chúng tôi sẽ hoàn tiền đầy đủ và không cần lý do.",
                // Các từ khóa liên quan đến "hoàn tiền"
                keywords: ["hoàn tiền", "chính sách hoàn tiền", "yêu cầu hoàn tiền", "trả lại tiền", "bao giờ được hoàn tiền", "quy trình hoàn tiền"]
            },
            {
                question: "Làm sao để liên hệ hỗ trợ khách hàng của Street Style?",
                answer: "Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giải đáp mọi thắc mắc và hỗ trợ bạn. Bạn có thể liên hệ qua hotline 0989908100 hoặc gửi email về support@streetstyle.vn.",
                // Các từ khóa liên quan đến "hỗ trợ khách hàng"
                keywords: ["hỗ trợ khách hàng", "liên hệ", "hotline", "số điện thoại", "email", "chăm sóc khách hàng", "liên lạc", "giúp đỡ"]
            },
            {
                question: "Cửa hàng có bảo hành sản phẩm không?",
                answer: "Tất cả sản phẩm của Street Style đều được bảo hành 3 tháng đối với các lỗi từ nhà sản xuất. Vui lòng giữ hóa đơn để được hỗ trợ tốt nhất.",
                keywords: ["bảo hành", "chính sách bảo hành", "sửa chữa", "thời gian bảo hành"]
            },
            {
                question: "Địa chỉ cửa hàng Street Style ở đâu?",
                answer: "Cửa hàng Street Style có địa chỉ tại 2 Đ. Trường Sa, Phường 17, Bình Thạnh, Hồ Chí Minh 70000, Việt Nam.",
                keywords: ["địa chỉ", "cửa hàng", "ở đâu", "vị trí", "shop"]
            },
            {
                question: "Giờ làm việc của Street Style là khi nào?",
                answer: "Giờ làm việc của Street Style là:\nThứ 2 - Thứ 6: 8:00 - 21:00\nThứ 7 - Chủ Nhật: 9:00 - 22:00.",
                keywords: ["giờ làm việc", "mở cửa", "thời gian hoạt động", "giờ mở cửa"]
            },
            {
                question: "Làm sao để liên hệ trực tiếp hỗ trợ khách hàng?",
                answer: "Bạn có thể liên hệ hỗ trợ khách hàng của Street Style qua hotline: +84 348 134 940 (Hỗ trợ 24/7 cho đơn hàng trực tuyến) hoặc gửi email tới support@streetstyle.com. Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
                keywords: ["liên hệ", "hỗ trợ khách hàng", "số điện thoại", "hotline", "email", "gửi email", "liên lạc", "chăm sóc khách hàng"]
            },
            {
                question: "Street Style có mặt trên mạng xã hội nào?",
                answer: "Bạn có thể theo dõi Street Style trên các nền tảng mạng xã hội: Facebook, GitHub, và LinkedIn.",
                keywords: ["mạng xã hội", "Facebook", "GitHub", "LinkedIn", "theo dõi"]
            }
        ];

        await FAQ.insertMany(faqsData);
        console.log('FAQs added successfully!');

    } catch (error) {
        console.error('Error adding FAQs:', error);
    } finally {
        mongoose.disconnect();
    }
})
.catch(err => console.error('Could not connect to MongoDB:', err));