import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const UserForm = ({
  user = {},
  roles = [],
  onSubmit,
  onCancel,
  isEdit = false,
  error = "",
  loading = false,
}) => {
  // Khởi tạo form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  //xu ly su kien nut huy bo
  const handleCancel = () =>{
    //Quay lai trang truoc do
    navigate(-1);
  }

  // Khởi tạo giá trị
  useEffect(() => {
    if (isEdit && user) {
      // Xử lý cho trường hợp chỉnh sửa
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", 
        role: user.role?._id || user.role || "", 
      });
    } else if (!isEdit && roles.length > 0) {
      // Xử lý cho trường hợp tạo mới
      setFormData(prev => ({
        ...prev,
        role: roles[0]?._id || "", 
      }));
    }
  }, [user, roles, isEdit]);

  // Xử lý thay đổi giá trị form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi validation khi người dùng nhập
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = "Vui lòng nhập tên";
    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!isEdit && formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!formData.role) {
      errors.role = "Vui lòng chọn vai trò";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Chuẩn bị dữ liệu để gửi đi
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        ...(!isEdit && { password: formData.password }), 
        role: formData.role, 
      };

      // console.log("Form data to submit:", submitData); 
      onSubmit(submitData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Hiển thị lỗi chung */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trường tên */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tên người dùng"
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>

        {/* Trường email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập địa chỉ email"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>

        {/* Trường mật khẩu (chỉ hiển thị khi tạo mới) */}
        {!isEdit && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>
        )}

        {/* Trường vai trò */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Vai trò *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.role ? "border-red-500" : "border-gray-300"
            } ${roles.length === 0 ? "bg-gray-100" : ""}`}
            disabled={roles.length === 0}
          >
            {roles.length === 0 ? (
              <option value="">Đang tải vai trò...</option>
            ) : (
              <>
                <option value="">-- Chọn vai trò --</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {validationErrors.role && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
          )}
        </div>

        {/* Nhóm nút hành động */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
              </span>
            ) : isEdit ? "Cập nhật" : "Tạo mới"}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

// Prop types validation
UserForm.propTypes = {
  user: PropTypes.object,
  roles: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default UserForm;