import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: { // Câu hỏi thường gặp
        type: String,
        required: true,
        unique: true
    },
    answer: { // Câu trả lời tương ứng
        type: String,
        required: true
    },
    keywords: [String] // Các từ khóa liên quan để tìm kiếm FAQ
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;