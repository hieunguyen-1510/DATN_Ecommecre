import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, navigate, backendUrl, setUser } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "Sign Up") {
        if (password !== confirmPassword) {
          toast.error("Mật khẩu không khớp");
          return;
        }
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (response.data.success) {
          toast.success("Đăng ký thành công! Hãy đăng nhập!");
          setCurrentState("Login");
          // Lưu name và email
          const userData = { name, email };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          toast.success("Bạn đã đăng nhập thành công!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          // Lấy user hiện tại từ localStorage để giữ name đã đăng ký
          const storedUser = JSON.parse(localStorage.getItem("user")) || {};
          // Neu api tra ve user dung luon cua api
          const userData = {
            name: response.data.user?.name || storedUser.name || "Người dùng",
            email: response.data.user?.email || email,
            avatar: response.data.user?.avatar || storedUser.avatar || " " // Luu avata
          };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-lg w-[90%] sm:max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 uppercase tracking-wider text-gray-900">
          {currentState === "Login" ? "Welcome Back" : "Join The Street"}
        </h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          {currentState === "Sign Up" && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
              placeholder="Password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {currentState === "Sign Up" && (
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showPassword ? "text" : "password"}
                className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400 bg-gray-50"
                placeholder="Confirm Password"
                required
              />
            </div>
          )}
          <div className="flex justify-between text-sm">
            {currentState === "Login" && (
              <p
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer text-yellow-500 hover:underline"
              >
                Forgot password?
              </p>
            )}
            <p
              onClick={() =>
                setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
              }
              className="cursor-pointer text-yellow-500 hover:underline ml-auto"
            >
              {currentState === "Login" ? "Create Account" : "Login Here"}
            </p>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-black font-bold py-3 rounded-md hover:bg-yellow-600 transition"
          >
            {currentState === "Login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
