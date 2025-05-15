import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl} from "../../App";
const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reviews`, {
        params: { productId },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${backendUrl}/api/reviews/${id}`, { status });
      fetchReviews(); 
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await axios.delete(`${backendUrl}/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý đánh giá</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {review.userId?.name?.[0] || "U"}
                  </div>
                  <p className="font-semibold text-gray-800">
                    {review.userId?.name || "Khách hàng ẩn danh"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">
                    ({review.rating}/5)
                  </span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  review.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : review.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {review.status === "approved"
                  ? "Đã duyệt"
                  : review.status === "rejected"
                  ? "Đã từ chối"
                  : "Chờ xử lý"}
              </span>
            </div>

            <p className="text-gray-700 pl-12 mb-4">{review.comment}</p>

            <div className="flex gap-3 pl-12">
              {review.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(review._id, "approved")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => updateStatus(review._id, "rejected")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Từ chối
                  </button>
                </>
              )}
              <button
                onClick={() => deleteReview(review._id)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;