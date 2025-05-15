import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.data || response.data;

        if (!userData?._id) {
          throw new Error("Dữ liệu không hợp lệ");
        }

        setUser(userData);
        setError("");
      } catch (err) {
        console.error("Chi tiết lỗi:", {
          status: err.response?.status,
          data: err.response?.data,
        });

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        setError(err.response?.data?.message || "Không thể tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 animate-pulse text-lg">
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-sm">
          {error}
          <Link
            to="/users"
            className="block mt-3 text-blue-600 hover:underline font-medium"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow-sm">
          Người dùng không tồn tại
          <Link
            to="/users"
            className="block mt-3 text-blue-600 hover:underline font-medium"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/users"
          className="text-blue-600 hover:underline font-medium flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Danh sách người dùng
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-200">
        Thông tin chi tiết
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-500">Tên</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {user.name || "Chưa cập nhật"}
          </p>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1 text-lg font-semibold text-gray-900 break-all">
            {user.email || "Chưa cập nhật"}
          </p>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-500">Vai trò</label>
          <span
            className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-medium ${
              user.role?.name === "admin" // Kiểm tra name của role
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role?.name
              ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1)
              : "User"}
          </span>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Chưa cập nhật"}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Link
            to={`/users/edit/${id}`}
            className="inline-block bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            Chỉnh sửa thông tin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
