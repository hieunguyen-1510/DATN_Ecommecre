import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const Reviews = ({ productId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null);

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
    setLoading(true);
    setError(null);

    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // if (!storedToken) {
    //   toast.error("Bạn không có quyền truy cập. Vui lòng đăng nhập.");
    //   setLoading(false);
    //   return;
    // }
    // Tạo một object config cho axios
    let axiosConfig = {
      params: productId ? { productId } : {},
    };
    // Chỉ thêm header Authorization nếu có token
    if (storedToken) {
      axiosConfig.headers = {
        Authorization: `Bearer ${storedToken}`,
      };
    }

    try {
      // const res = await axios.get(`${backendUrl}/api/reviews`, {
      //   headers: {
      //     Authorization: `Bearer ${storedToken}`,
      //   },
      //   params: productId ? { productId } : {},
      // });
      const res = await axios.get(`${backendUrl}/api/reviews`, axiosConfig);
      setReviews(res.data);
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
      // Xử lý lỗi từ backend
      // let errorMessage = err.response?.data?.message || "Lỗi khi tải đánh giá!";
      // if (
      //   err.response &&
      //   (err.response.status === 401 || err.response.status === 403)
      // ) {
      //   errorMessage =
      //     "Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản hợp lệ.";
      // }
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        
        errorMessage = "Bạn không có quyền xem tất cả đánh giá. Chỉ những đánh giá đã duyệt được hiển thị.";
      }
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!storedToken) {
      toast.error("Bạn không có quyền cập nhật. Vui lòng đăng nhập.");
      return;
    }
    try {
      const res = await axios.put(
        `${backendUrl}/api/reviews/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (res.data) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchReviews();
      } else {
        toast.error("Cập nhật trạng thái thất bại: Không có dữ liệu trả về.");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật đánh giá:", err);
      const errorMessage =
        err.response?.data?.message || "Lỗi khi cập nhật đánh giá!";
      toast.error(errorMessage);
    }
  };

  const confirmDelete = (id) => {
    setReviewToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!reviewToDeleteId) return;

    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!storedToken) {
      toast.error("Bạn không có quyền xóa. Vui lòng đăng nhập.");
      setShowConfirmModal(false);
      return;
    }

    try {
      const res = await axios.delete(
        `${backendUrl}/api/reviews/${reviewToDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (res.data) {
        toast.success("Xóa đánh giá thành công!");
        fetchReviews();
      } else {
        toast.error("Xóa đánh giá thất bại: Không có dữ liệu trả về.");
      }
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err);
      const errorMessage =
        err.response?.data?.message || "Lỗi khi xóa đánh giá!";
      toast.error(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setReviewToDeleteId(null);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center text-gray-600 font-semibold py-8">
        Đang tải đánh giá...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center text-red-600 font-semibold bg-red-50 rounded-lg py-8">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý đánh giá
      </h2>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-gray-500 text-center py-8 border rounded-lg bg-white">
            Hiện chưa có đánh giá nào.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {review.userId?.avatar ? (
                      <img
                        src={review.userId.avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {review.userId?.name?.[0] || "U"}
                      </div>
                    )}
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

              {review.productId && (
                <div className="flex items-center gap-3 mt-4 mb-4 border-t pt-4">
                  {review.productId.image && (
                    <img
                      src={review.productId.image}
                      alt={review.productId.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <p className="text-gray-700 font-medium">
                    Sản phẩm: {review.productId.name || "Không xác định"}
                  </p>
                </div>
              )}

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
                  onClick={() => confirmDelete(review._id)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Xác nhận xóa
            </h3>
            <p className="text-gray-700 mb-6">
              Bạn chắc chắn muốn xóa đánh giá này?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
