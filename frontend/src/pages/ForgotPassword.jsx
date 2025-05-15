import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      toast.success(response.data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-lg w-[90%] sm:max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Quên Mật Khẩu</h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          <div className="relative">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full py-3 pl-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
              placeholder="Nhập email đã đăng ký"
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
            {isSubmitting ? "Đang gửi..." : "Gửi Link Đặt Lại"}
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

export default ForgotPassword;