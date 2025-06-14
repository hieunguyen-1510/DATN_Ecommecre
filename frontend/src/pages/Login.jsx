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
          const storedUser = JSON.parse(localStorage.getItem("user")) || {};
          // Neu api tra ve user dung luon cua api
          const userData = {
            name: response.data.user?.name || storedUser.name || "Người dùng",
            email: response.data.user?.email || email,
            avatar: response.data.user?.avatar || storedUser.avatar || " ", 
            // rank: response.data.user?.rank || "Chưa mua hàng", 
            avatar: response.data.user?.avatar || storedUser.avatar || " ", // Luu avata
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 shadow-2xl rounded-xl w-[90%] sm:max-w-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center mb-8 uppercase tracking-widest text-gray-800">
          {currentState === "Login" ? "Welcome Back" : "Join The Street"}
        </h2>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
          {currentState === "Sign Up" && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              className="w-full py-3 pl-10 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
              placeholder="Password"
              required
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
                className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-gray-800"
                placeholder="Confirm Password"
                required
              />
            </div>
          )}
          <div className="flex justify-between text-sm mt-1">
            {currentState === "Login" && (
              <p
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200"
              >
                Forgot password?
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
              {currentState === "Login" ? "Create Account" : "Login Here"}
            </p>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-extrabold py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {currentState === "Login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
