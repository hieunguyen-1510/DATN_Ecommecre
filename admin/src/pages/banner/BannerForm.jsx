import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

function BannerForm({ bannerToEdit, onBannerSaved }) {
  const [form, setForm] = useState({
    imageUrl: "",
    active: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (bannerToEdit) {
      setForm({
        imageUrl: bannerToEdit.imageUrl || "",
        active: bannerToEdit.active || false,
      });
    } else {
      setForm({
        imageUrl: "",
        active: false,
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
      // Payload chỉ chứa imageUrl và active
      const payload = { imageUrl: form.imageUrl, active: form.active };

      if (bannerToEdit && bannerToEdit._id) {
        res = await axios.put(
          `${backendUrl}/api/banners/${bannerToEdit._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(`${backendUrl}/api/banners`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (onBannerSaved) onBannerSaved(res.data);
      if (!bannerToEdit) {
        // Reset form
        setForm({
          imageUrl: "",
          active: false,
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

      {/* Checkbox active */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="active"
          checked={form.active}
          onChange={handleChange}
          disabled={loading}
          id="activeCheckbox"
        />
        <label htmlFor="activeCheckbox" className="font-medium">
          Kích hoạt (hiển thị ngay khi được lưu/cập nhật)
        </label>
      </div>

      {error && <div className="text-red-600 font-semibold">{error}</div>}

      <button
        type="submit"
        className="w-full py-3 rounded bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading
          ? bannerToEdit
            ? "Đang cập nhật..."
            : "Đang tạo..."
          : bannerToEdit
          ? "Cập nhật Banner"
          : "Tạo Banner"}
      </button>
    </form>
  );
}

export default BannerForm;
