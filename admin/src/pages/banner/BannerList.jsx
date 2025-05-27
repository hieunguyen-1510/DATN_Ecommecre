import React from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

function BannerList({
  banners,
  onEdit,
  onBannerDeleted,
  onBannerStatusChanged,
}) {
  const token = localStorage.getItem("token");

  // xử lý kích hoạt và hủy kích hoạt
  const handleToggleStatus = async (id, currentActive) => {
    try {
      let res;
      if (currentActive) {
        // Kiểm tra currentActive
        res = await axios.put(
          `${backendUrl}/api/banners/${id}/deactivate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Hủy kích hoạt banner thành công!");
      } else {
        res = await axios.put(
          `${backendUrl}/api/banners/${id}/activate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Kích hoạt banner thành công!");
      }
      // Gọi hàm callback
      if (onBannerStatusChanged) onBannerStatusChanged(res.data.banner);
    } catch (err) {
      toast.error(
        `Thao tác thất bại: ${
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Lỗi không xác định"
        }`
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa banner này?")) {
      try {
        await axios.delete(`${backendUrl}/api/banners/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onBannerDeleted) onBannerDeleted(id);
        toast.success("Xóa banner thành công.");
      } catch {
        toast.error("Xóa banner thất bại.");
      }
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banners.map((banner) => (
        <div key={banner._id} className="bg-white p-4 rounded-xl shadow">
          <img
            src={banner.imageUrl}
            alt="Banner Image"
            className="w-full h-40 object-cover rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/cccccc/333333?text=No+Image";
            }}
          />
          <div className="mt-3">
            <div className="text-sm text-gray-600">
              Trạng thái:{" "}
              <span
                className={banner.active ? "text-green-600" : "text-gray-400"}
              >
                {banner.active ? "Đang sử dụng" : "Ẩn"}{" "}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Ngày tạo: {new Date(banner.created_at).toLocaleDateString()}{" "}
              {/* Hiển thị created_at */}
            </div>
            <div className="flex space-x-2 mt-2">
              {/* Nút Kích hoạt/Hủy kích hoạt */}
              <button
                onClick={() => handleToggleStatus(banner._id, banner.active)}
                className={`px-3 py-1 rounded font-semibold ${
                  banner.active
                    ? "bg-red-500 text-white hover:bg-red-700"
                    : "bg-blue-500 text-white hover:bg-blue-700"
                }`}
              >
                {banner.active ? "Hủy kích hoạt" : "Kích hoạt"}{" "}
                {/* Đổi banner.isActive thành banner.active */}
              </button>
              <button
                onClick={() => onEdit(banner)}
                className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-700"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BannerList;
