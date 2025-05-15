import React, { useState, useEffect } from "react";

const UserForm = ({
  user,
  roles = [],
  onSubmit,
  onCancel,
  isEdit = false,
  error,
  loading,
}) => {
  // Khởi tạo formData với role là ID (nếu có)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || (roles.length > 0 ? roles[0]._id : ""),
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Cập nhật formData khi roles thay đổi (tránh lỗi khởi tạo ban đầu)
  useEffect(() => {
    if (!isEdit && roles.length > 0 && !formData.role) {
      setFormData((prev) => ({
        ...prev,
        role: roles[0]._id,
      }));
    }
  }, [roles]);

  // Hàm chuyển đổi ID role sang tên để hiển thị
  const getRoleNameById = (roleId) => {
    const role = roles.find((r) => r._id === roleId);
    return role ? role.name : "Đang tải...";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // Gửi role ID
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên *
          </label>
          <input
            type="text"
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập địa chỉ email"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Mật khẩu (chỉ hiển thị khi thêm mới) */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu"
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>
        )}

        {/* Vai trò */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vai trò *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={roles.length === 0}
          >
            {roles.length > 0 ? (
              roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))
            ) : (
              <option value="">Không có vai trò nào</option>
            )}
          </select>
        </div>

        {/* Nút submit và cancel */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || roles.length === 0}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
              loading || roles.length === 0
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm mới"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-md bg-gray-300 text-gray-700 font-medium hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
