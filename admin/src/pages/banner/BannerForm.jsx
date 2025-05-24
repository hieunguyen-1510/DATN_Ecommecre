// components/BannerForm.jsx (giữ nguyên hoặc chỉ kiểm tra lại phần isActive)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

const positions = [
  { value: "home_slider", label: "Slider Trang chủ" },
  { value: "home_top", label: "Banner Đầu Trang" },
];

function BannerForm({ userId, bannerToEdit, onBannerSaved }) {
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    targetUrl: "",
    position: "home_slider",
    order: 0,
    isActive: false, // Mặc định là false khi tạo mới
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (bannerToEdit) {
      setForm({
        title: bannerToEdit.title || "",
        imageUrl: bannerToEdit.imageUrl || "",
        targetUrl: bannerToEdit.targetUrl || "",
        position: bannerToEdit.position || "home_slider",
        order: bannerToEdit.order || 0,
        isActive: bannerToEdit.isActive || false, // Đảm bảo lấy đúng isActive khi chỉnh sửa
        description: bannerToEdit.description || "",
      });
    } else {
      setForm({
        title: "",
        imageUrl: "",
        targetUrl: "",
        position: "home_slider",
        order: 0,
        isActive: false,
        description: "",
      });
    }
  }, [bannerToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (bannerToEdit && bannerToEdit._id) {
        res = await axios.put(
          `${backendUrl}/api/banners/${bannerToEdit._id}`,
          { ...form, createdBy: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          `${backendUrl}/api/banners`,
          { ...form, createdBy: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (onBannerSaved) onBannerSaved(res.data);
      if (!bannerToEdit) { // Reset form only after creating a new banner
        setForm({
          title: "",
          imageUrl: "",
          targetUrl: "",
          position: "home_slider",
          order: 0,
          isActive: false,
          description: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Lỗi khi lưu banner. Vui lòng kiểm tra lại dữ liệu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow space-y-4 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {bannerToEdit ? "Cập nhật Banner" : "Tạo Banner Mới"}
      </h2>

      <div>
        <label className="block mb-1 font-medium">Tiêu đề</label>
        <input
          className="w-full p-3 rounded bg-gray-800 text-white"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nhập tiêu đề banner"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">URL Hình ảnh</label>
        <input
          className="w-full p-3 rounded bg-gray-800 text-white"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Nhập URL hình ảnh (png, jpg, webp...)"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">URL đích (nếu có)</label>
        <input
          className="w-full p-3 rounded bg-gray-100"
          name="targetUrl"
          value={form.targetUrl}
          onChange={handleChange}
          placeholder="Nhập URL đích khi click (nếu có)"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Vị trí Banner</label>
        <select
          className="w-full p-3 rounded bg-gray-100"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
          disabled={loading}
        >
          {positions.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Thứ tự hiển thị</label>
        <input
          className="w-full p-3 rounded bg-gray-100"
          name="order"
          type="number"
          min={0}
          value={form.order}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {/* Checkbox isActive: Không cần nút riêng cho activate/deactivate ở đây vì đã có ở BannerList */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          disabled={loading}
          id="isActiveCheckbox"
        />
        <label htmlFor="isActiveCheckbox" className="font-medium">
          Kích hoạt (hiển thị ngay khi được lưu/cập nhật)
        </label>
      </div>

      <div>
        <label className="block mb-1 font-medium">Người tạo (User ID)</label>
        <input
          className="w-full p-3 rounded bg-gray-100"
          value={userId}
          disabled
        />
      </div>

      {error && <div className="text-red-600 font-semibold">{error}</div>}

      <button
        type="submit"
        className="w-full py-3 rounded bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (bannerToEdit ? "Đang cập nhật..." : "Đang tạo...") : bannerToEdit ? "Cập nhật Banner" : "Tạo Banner"}
      </button>
    </form>
  );
}

export default BannerForm;