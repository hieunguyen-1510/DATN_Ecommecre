import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { FaTimes } from "react-icons/fa";

const Profile = () => {
  const { token, user, navigate, updateUser } = useContext(ShopContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserInfo({
      name: user?.name || storedUser.name || "Người dùng",
      email: user?.email || storedUser.email || "",
      phone: storedUser.phone || "03481349940",
      address: storedUser.address || "41,Đường Số 1, KP1, Hiệp Bình Chánh,Thủ Đức, TP.HCM",
      avatar: storedUser.avatar || "",
    });
  }, [token, user, navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prev) => ({ ...prev, avatar: reader.result }));
        toast.success("Ảnh đại diện đã được cập nhật!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success("Thông tin đã được lưu!");
    localStorage.setItem("user", JSON.stringify(userInfo));
    updateUser(userInfo);
    setIsEditing(false);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6 md:px-10 flex items-center justify-center">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-lg shadow-lg p-4 sm:p-6 animate-fadeIn relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Đóng"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center mb-0">
          Hồ sơ của tôi
        </h1>
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={userInfo.avatar || assets.profile}
              alt="Avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="text-lg sm:text-xl text-gray-800 mt-3 font-semibold text-center">
            {userInfo.name}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
                  {userInfo.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập email"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
                  {userInfo.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
                  {userInfo.phone || "Chưa cập nhật"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
                  {userInfo.address || "Chưa cập nhật"}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lưu
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;