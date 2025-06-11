import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa"; 

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        password,
      });
      toast.success(response.data.message);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-lg w-[90%] sm:max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Đặt Lại Mật Khẩu</h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
              placeholder="Xác nhận mật khẩu mới"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-3 rounded-md text-white font-bold transition ${
              isSubmitting ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập Nhật Mật Khẩu"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Quay lại{" "}
          <Link to="/login" className="text-yellow-500 cursor-pointer hover:underline">
            Đăng Nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
