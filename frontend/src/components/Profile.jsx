import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Profile = () => {
  const { token, user, navigate, updateUser} = useContext(ShopContext);
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Hồ sơ của tôi</h1>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative group">
            <img
              src={userInfo.avatar || assets.profile}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md transition-transform duration-300 group-hover:scale-105"
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
          <h2 className="text-xl font-semibold text-gray-800 mt-4">{userInfo.name}</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                  placeholder="Nhập email"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <p className="p3 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
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
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
                  {userInfo.address || "Chưa cập nhật"}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Lưu
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-all duration-300 transform hover:scale-105"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
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