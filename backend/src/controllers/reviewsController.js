import reviewModel from "../models/reviewModel.js"

// Tạo đánh giá mới
const createReview = async(req,res) =>{
    try {
        const {productId, userId,rating, comment} = req.body;
        if (!productId || !userId || !rating) {
            return res.status(400).json({message:"Thiếu dữ liệu bắt buộc!"})
        }
        const newReview = await reviewModel.create({
            productId,
            userId,
            rating,
            comment
        })
        res.status(201).json(newReview);
     
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Lỗi server", error: err.message});
    }
}

// Lấy danh sách đánh giá theo productId
const getReviews = async(req,res) =>{
    try {
        const {productId} = req.query;
        const query = productId ? {productId} : {};

        const reviews = await reviewModel.find(query)
        .populate('userId','name') // lấy tên người dùng
        .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Lỗi server", error: err.message});
    }
}

// Cập nhật trạng thái
const updateReviewStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
      }
      const updated = await reviewModel.findByIdAndUpdate(id, { status }, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  };
  
  // Xóa đánh giá
  const deleteReview = async (req, res) => {
    try {
      const { id } = req.params;
      await reviewModel.findByIdAndDelete(id);
      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  };
  
export { createReview, getReviews, updateReviewStatus, deleteReview };
  