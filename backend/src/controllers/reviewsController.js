import Review from "../models/reviewModel.js";

// create review
const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res
        .status(400)
        .json({ message: "Thiếu dữ liệu bắt buộc (sản phẩm, đánh giá sao)!" });
    }
    
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res
        .status(409)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi!" });
    }
    const newReview = await Review.create({
      productId,
      userId,
      rating,
      comment,
      status: 'pending'
    });
    res.status(201).json(newReview);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// get list review
const getReviews = async (req, res) => {
    try {
        const { productId } = req.query;
        // Lấy thông tin user
        const userRole = req.user?.role; 
        const userId = req.user?._id; 

        let query = {};
        if (productId) {
            query.productId = productId;
        }

        // Logic này đúng nếu userRole
        // if (userRole !== 'admin') {
        //     query.status = 'approved';
        // }
        
        const reviews = await Review.find(query)
            .populate("userId", "name avatar")
            .populate("productId", "name image")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err); 
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// update review status
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }
    const updated = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export { createReview, getReviews, updateReviewStatus, deleteReview };
