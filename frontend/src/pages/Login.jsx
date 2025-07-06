import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, navigate, backendUrl, setUser } =
    useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currentState === "Sign Up") {
        if (name.trim() === "") return toast.error("Tên không được để trống");
        if (!isValidEmail(email)) return toast.error("Email không hợp lệ");
        if (password.length < 8)
          return toast.error("Mật khẩu phải có ít nhất 8 ký tự");
        if (password !== confirmPassword)
          return toast.error("Mật khẩu không khớp");

        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Đăng ký thành công! Hãy đăng nhập!");
          setCurrentState("Login");
        } else {
          toast.error(response.data.message || "Đăng ký thất bại");
        }
      } else {
        if (!isValidEmail(email)) return toast.error("Email không hợp lệ");
        if (password.length < 8)
          return toast.error("Mật khẩu phải có ít nhất 8 ký tự");

        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Bạn đã đăng nhập thành công!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);

          const userData = response.data.user;
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        } else {
          toast.error(response.data.message || "Đăng nhập thất bại");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Lỗi không xác định"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 shadow-2xl rounded-xl w-[90%] sm:max-w-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center mb-8 uppercase tracking-widest text-gray-800">
          {currentState === "Login"
            ? "Chào mừng quay lại"
            : "Đăng ký để bắt đầu"}
        </h2>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
          {currentState === "Sign Up" && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                aria-label="Tên người dùng"
                autoComplete="name"
                placeholder="Họ tên..."
                required
                className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              aria-label="Địa chỉ email"
              autoComplete="email"
              placeholder="Email..."
              required
              className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              aria-label="Mật khẩu"
              autoComplete={
                currentState === "Login" ? "current-password" : "new-password"
              }
              placeholder="Mật khẩu..."
              required
              className="w-full py-3 pl-10 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {currentState === "Sign Up" && (
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showPassword ? "text" : "password"}
                aria-label="Xác nhận mật khẩu"
                autoComplete="new-password"
                placeholder="Xác nhận mật khẩu..."
                required
                className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
              />
            </div>
          )}

          <div className="flex justify-between text-sm mt-1">
            {currentState === "Login" && (
              <p
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200"
              >
                Quên mật khẩu?
              </p>
            )}
            <p
              onClick={() =>
                setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
              }
              className={`cursor-pointer text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200 ${
                currentState === "Login" ? "ml-auto" : ""
              }`}
            >
              {currentState === "Login" ? "Đăng ký ngay" : "Đăng nhập tại đây"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 text-white font-extrabold py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading
              ? "Đang xử lý..."
              : currentState === "Login"
              ? "Đăng nhập"
              : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
