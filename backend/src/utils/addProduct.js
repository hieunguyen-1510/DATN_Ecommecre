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
        await FAQ.deleteMany({}); // Xóa dữ liệu cũ

        const faqsData = [
            // --- Phương thức thanh toán ---
            {
                question: "Cửa hàng có những phương thức thanh toán nào?",
                answer: "Street Style chấp nhận thanh toán qua ngân hàng (VNPAY), thanh toán qua ví điện tử (MOMO) và thanh toán khi nhận hàng (COD).",
                keywords: ["thanh toán", "phương thức", "COD", "MOMO", "VNPAY", "trả tiền"]
            },
            // --- Chính sách đổi trả ---
            {
                question: "Chính sách đổi trả của cửa hàng như thế nào?",
                answer: "Cửa hàng Street Style chấp nhận đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tag, chưa qua sử dụng và có hóa đơn mua hàng. Vui lòng liên hệ bộ phận chăm sóc khách hàng để được hướng dẫn chi tiết.",
                keywords: ["đổi trả", "chính sách đổi trả", "đổi hàng", "trả hàng", "đổi sản phẩm", "điều kiện đổi trả", "quy định đổi trả"]
            },
            // --- Chính sách hoàn tiền ---
            {
                question: "Chính sách hoàn tiền của cửa hàng là gì?",
                answer: "Street Style cam kết hoàn tiền trong vòng 7 ngày nếu sản phẩm lỗi từ nhà sản xuất hoặc không đúng mô tả, với quy trình minh bạch. Chúng tôi sẽ hoàn tiền đầy đủ và không cần lý do.",
                keywords: ["hoàn tiền", "chính sách hoàn tiền", "yêu cầu hoàn tiền", "trả lại tiền", "bao giờ được hoàn tiền", "quy trình hoàn tiền"]
            },
            // --- Liên hệ hỗ trợ khách hàng ---
            {
                question: "Làm sao để liên hệ hỗ trợ khách hàng của Street Style?",
                answer: "Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24/7 để giải đáp mọi thắc mắc và hỗ trợ bạn. Bạn có thể liên hệ qua hotline 0989908100 hoặc gửi email về support@streetstyle.vn.",
                keywords: ["hỗ trợ khách hàng", "liên hệ", "hotline", "số điện thoại", "email", "chăm sóc khách hàng", "liên lạc", "giúp đỡ"]
            },
            // --- Chính sách bảo hành ---
            {
                question: "Cửa hàng có bảo hành sản phẩm không?",
                answer: "Tất cả sản phẩm của Street Style đều được bảo hành 3 tháng đối với các lỗi từ nhà sản xuất. Vui lòng giữ hóa đơn để được hỗ trợ tốt nhất.",
                keywords: ["bảo hành", "chính sách bảo hành", "sửa chữa", "thời gian bảo hành"]
            },
            // --- Địa chỉ cửa hàng ---
            {
                question: "Địa chỉ cửa hàng Street Style ở đâu?",
                answer: "Cửa hàng Street Style có địa chỉ tại 2 Đ. Trường Sa, Phường 17, Bình Thạnh, Hồ Chí Minh 70000, Việt Nam.",
                keywords: ["địa chỉ", "cửa hàng", "ở đâu", "vị trí", "shop"]
            },
            // --- Giờ làm việc ---
            {
                question: "Giờ làm việc của Street Style là khi nào?",
                answer: "Giờ làm việc của Street Style là:\nThứ 2 - Thứ 6: 8:00 - 21:00\nThứ 7 - Chủ Nhật: 9:00 - 22:00.",
                keywords: ["giờ làm việc", "mở cửa", "thời gian hoạt động", "giờ mở cửa"]
            },
            // --- Liên hệ trực tiếp  ---
            {
                question: "Làm sao để liên hệ trực tiếp hỗ trợ khách hàng?",
                answer: "Bạn có thể liên hệ hỗ trợ khách hàng của Street Style qua hotline: +84 348 134 940 (Hỗ trợ 24/7 cho đơn hàng trực tuyến) hoặc gửi email tới support@streetstyle.vn. Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
                keywords: ["liên hệ", "hỗ trợ khách hàng", "số điện thoại", "hotline", "email", "gửi email", "liên lạc", "chăm sóc khách hàng"]
            },
            // --- Mạng xã hội ---
            {
                question: "Street Style có mặt trên mạng xã hội nào?",
                answer: "Bạn có thể theo dõi Street Style trên các nền tảng mạng xã hội: Facebook, GitHub, và LinkedIn.",
                keywords: ["mạng xã hội", "Facebook", "GitHub", "LinkedIn", "theo dõi"]
            },

            // --- Vận chuyển & Giao hàng ---
            {
                question: "Chi phí vận chuyển là bao nhiêu?",
                answer: "Phí vận chuyển của Street Style được tính dựa trên địa chỉ giao hàng và trọng lượng đơn hàng. Bạn có thể xem chi tiết phí ship tại trang thanh toán trước khi hoàn tất đơn hàng.",
                keywords: ["phí ship", "vận chuyển", "giao hàng", "bao nhiêu tiền ship", "giá ship"]
            },
            {
                question: "Thời gian giao hàng dự kiến là bao lâu?",
                answer: "Thời gian giao hàng dự kiến của Street Style trong nội thành TP.HCM là 1-2 ngày làm việc, các tỉnh thành khác từ 3-5 ngày làm việc, tùy thuộc vào địa điểm.",
                keywords: ["thời gian giao hàng", "bao lâu thì nhận được", "giao nhanh không", "mấy ngày nhận được hàng"]
            },
            {
                question: "Tôi có thể theo dõi đơn hàng của mình bằng cách nào?",
                answer: "Bạn có thể theo dõi trạng thái đơn hàng của mình bằng cách truy cập vào đường link được gửi trong email xác nhận đơn hàng hoặc đăng nhập vào tài khoản của bạn trên website và kiểm tra mục \"Đơn hàng của tôi\".",
                keywords: ["theo dõi đơn hàng", "kiểm tra đơn hàng", "tracking", "tình trạng đơn hàng"]
            },
            {
                question: "Cửa hàng có giao hàng quốc tế không?",
                answer: "Hiện tại, Street Style chỉ hỗ trợ giao hàng trong lãnh thổ Việt Nam. Chúng tôi đang nỗ lực để mở rộng dịch vụ giao hàng quốc tế trong tương lai.",
                keywords: ["giao hàng quốc tế", "ship nước ngoài", "gửi hàng đi nước ngoài"]
            },

            // --- Thông tin sản phẩm chi tiết & Tư vấn mua hàng ---
            {
                question: "Làm sao để chọn size phù hợp?",
                answer: "Street Style có bảng size chi tiết cho từng loại sản phẩm. Bạn có thể tìm thấy bảng size tại trang chi tiết sản phẩm. Nếu cần hỗ trợ thêm, đừng ngần ngại liên hệ chúng tôi nhé!",
                keywords: ["chọn size", "bảng size", "kích cỡ", "size áo", "size quần", "đo size"]
            },
            {
                question: "Chất liệu sản phẩm này là gì?",
                answer: "Vui lòng cho tôi biết tên sản phẩm bạn muốn hỏi, tôi sẽ cung cấp thông tin chi tiết về chất liệu sản phẩm đó.",
                keywords: ["chất liệu", "vải gì", "sản phẩm làm bằng gì"]
            },
            {
                question: "Sản phẩm này có những màu nào?",
                answer: "Vui lòng cho tôi biết tên sản phẩm bạn muốn hỏi, tôi sẽ kiểm tra các màu sắc hiện có.",
                keywords: ["màu", "có màu gì", "bảng màu"]
            },
            {
                question: "Hướng dẫn bảo quản sản phẩm Street Style như thế nào?",
                answer: "Để sản phẩm Street Style luôn bền đẹp, bạn nên giặt bằng tay hoặc giặt máy với chế độ nhẹ, không sấy ở nhiệt độ cao và ủi ở nhiệt độ thấp. Chi tiết hướng dẫn bảo quản có trên tag sản phẩm.",
                keywords: ["bảo quản", "giặt", "ủi", "vệ sinh", "cách giặt"]
            },

            // --- Khuyến mãi & Chương trình khách hàng thân thiết ---
            {
                question: "Cửa hàng có chương trình khuyến mãi nào không?",
                answer: "Bạn có thể theo dõi trang khuyến mãi trên website hoặc các kênh mạng xã hội của Street Style để cập nhật những chương trình ưu đãi mới nhất nhé!",
                keywords: ["khuyến mãi", "giảm giá", "sale", "ưu đãi", "mã giảm giá", "voucher"]
            },
            {
                question: "Làm sao để nhận được thông báo về các chương trình khuyến mãi?",
                answer: "Bạn có thể đăng ký nhận bản tin của Street Style qua email để không bỏ lỡ bất kỳ chương trình khuyến mãi hay sản phẩm mới nào!",
                keywords: ["nhận thông báo", "bản tin", "email", "tin tức"]
            },

            // --- Tài khoản & Đăng nhập ---
            {
                question: "Tôi quên mật khẩu, phải làm sao?",
                answer: "Bạn có thể sử dụng chức năng \"Quên mật khẩu\" trên trang đăng nhập của Street Style và làm theo hướng dẫn để đặt lại mật khẩu mới.",
                keywords: ["quên mật khẩu", "không đăng nhập được", "lấy lại mật khẩu"]
            },
            {
                question: "Làm sao để tạo tài khoản mới?",
                answer: "Bạn có thể tạo tài khoản mới trên website Street Style bằng cách nhấp vào \"Đăng ký\" và điền các thông tin cần thiết.",
                keywords: ["tạo tài khoản", "đăng ký", "tài khoản mới"]
            },

            // --- Các câu hỏi chung và lời chào/kết thúc ---
            {
                question: "Chào bạn! / Xin chào.",
                answer: "Chào bạn! Tôi là Street Style, trợ lý ảo của cửa hàng Street Style. Bạn cần tôi giúp gì về thời trang hôm nay?",
                keywords: ["chào", "xin chào", "hello"]
            },
            {
                question: "Cảm ơn bạn. / Cảm ơn nhé.",
                answer: "Không có gì! Rất vui được hỗ trợ bạn. Nếu có bất kỳ câu hỏi nào khác, đừng ngần ngại hỏi tôi nhé!",
                keywords: ["cảm ơn", "cám ơn", "thank you"]
            },
            {
                question: "Bạn có thể giới thiệu về Street Style không?",
                answer: "Street Style là cửa hàng thời trang trực tuyến chuyên cung cấp những sản phẩm thời trang năng động, hiện đại và cá tính, giúp bạn tự tin thể hiện phong cách riêng.",
                keywords: ["giới thiệu", "Street Style là gì", "cửa hàng là gì", "về chúng tôi"]
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