import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ReviewProduct = ({ productId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Tính toán rating summary
  useEffect(() => {
    const calculateRatingSummary = () => {
      const summary = [0, 0, 0, 0, 0];
      allReviews.forEach((r) => summary[r.rating - 1]++);
      return summary;
    };

    const ratings = calculateRatingSummary();
    const total = ratings.reduce((acc, curr) => acc + curr, 0);
    const average =
      total > 0
        ? (
            ratings.reduce((acc, curr, index) => acc + curr * (index + 1), 0) /
            total
          ).toFixed(1)
        : 0;

    setTotalRating(average);
    setTotalReviews(total);
  }, [allReviews]);

  // Gửi đánh giá
  const handleSubmit = async () => {
    if (!review || rating === 0) {
      alert("Vui lòng đánh giá và viết nhận xét!");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userId: "680de4f7920e55a8a3fe926d",
          rating,
          comment: review,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gửi đánh giá thất bại");
      }

      const newReview = await response.json();

      setAllReviews([
        {
          id: newReview._id,
          name: "Hiếu Nguyễn",
          rating: newReview.rating,
          comment: newReview.comment,
          time: dayjs(newReview.createdAt).fromNow(),
        },
        ...allReviews,
      ]);

      setReview("");
      setRating(0);
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá!");
    }
  };

  // Lấy tất cả đánh giá
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/reviews?productId=${productId}`
        );
        const data = await res.json();
        setAllReviews(
          data.map((r) => ({
            id: r._id,
            name: r.userId?.name || "Ẩn danh",
            rating: r.rating,
            comment: r.comment,
            time: dayjs(r.createdAt).fromNow(),
          }))
        );
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  // Lọc đánh giá
  const filteredReviews =
    selectedRating === 0
      ? allReviews
      : allReviews.filter((r) => r.rating === selectedRating);

  return (
    <div className="mt-12 bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-7xl mx-auto">
      {/* Tổng hợp rating và thanh lọc sao */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mb-8">
        <div className="text-center w-full lg:w-1/4">
          <div className="text-4xl font-bold text-gray-800">{totalRating}</div>
          <div className="text-yellow-500 text-2xl mb-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.floor(totalRating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">{totalReviews} đánh giá</div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = allReviews.filter((r) => r.rating === star).length;
            const percentage =
              totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(0) : 0;

            return (
              <button
                key={star}
                onClick={() =>
                  setSelectedRating(star === selectedRating ? 0 : star)
                }
                className={`flex items-center gap-2 w-full p-1 rounded-md ${
                  selectedRating === star ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-14 text-sm text-gray-600">{star} sao</div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-8 text-sm text-gray-500">{count}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Viết đánh giá */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Viết đánh giá của bạn
        </h2>
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => setRating(i + 1)}
              className={`text-3xl transition-all ${
                i < rating
                  ? "text-yellow-500 scale-110"
                  : "text-gray-300 hover:scale-110"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Hãy chia sẻ cảm nghĩ của bạn về sản phẩm này..."
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={4}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Đánh giá sản phẩm ({filteredReviews.length})
        </h3>

        {filteredReviews.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Chưa có đánh giá phù hợp
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div key={r.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{r.name}</div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <div className="text-yellow-500 text-lg">
                      {"★".repeat(r.rating)}
                    </div>
                    <span className="text-gray-500 text-sm">{r.time}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 pl-12">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewProduct;
