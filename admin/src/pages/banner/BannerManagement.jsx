import React, { useState, useEffect } from "react";
import axios from "axios";
import BannerForm from "./BannerForm";
import BannerList from "./BannerList";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BannerManagement = ({ userId }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/banners`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Đảm bảo dữ liệu luôn là một mảng, ngay cả khi API trả về trực tiếp mảng thay vì {data: []}
        setBanners(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch {
        toast.error("Không thể tải danh sách banner");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [token]);

  const handleBannerSaved = (savedBanner) => {
    setBanners((prev) => {
      const index = prev.findIndex((b) => b._id === savedBanner._id);
      if (index !== -1) {
        // Update existing banner
        const newList = [...prev];
        newList[index] = savedBanner;
        return newList;
      } else {
        // Add new banner at the top
        return [savedBanner, ...prev];
      }
    });
    setBannerToEdit(null);
    toast.success(`Banner ${bannerToEdit ? "cập nhật" : "tạo"} thành công!`);
  };

  const handleBannerDeleted = (id) => {
    setBanners((prev) => prev.filter((b) => b._id !== id));
    toast.success("Xóa banner thành công!");
  };

  // Hàm mới để xử lý khi trạng thái banner thay đổi
  const handleBannerStatusChanged = (changedBanner) => {
    setBanners((prev) =>
      prev.map((b) => {
        // Nếu là banner vừa thay đổi, cập nhật trạng thái isActive của nó
        if (b._id === changedBanner._id) {
          return changedBanner;
        }
       
        if (changedBanner.isActive && b.position === changedBanner.position) {
          return { ...b, isActive: false };
        }
        return b;
      })
    );
    // Thông báo toast đã được xử lý trong BannerList, không cần ở đây nữa.
  };

  const handleEditClick = (banner) => {
    setBannerToEdit(banner);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-8">🎯 Quản lý Banner</h1>

      <BannerForm
        userId={userId}
        bannerToEdit={bannerToEdit}
        onBannerSaved={handleBannerSaved}
      />

      {loading ? (
        <p>Đang tải danh sách banner...</p>
      ) : (
        <BannerList
          banners={banners}
          onEdit={handleEditClick}
          onBannerDeleted={handleBannerDeleted}
          onBannerStatusChanged={handleBannerStatusChanged} 
        />
      )}
    </div>
  );
};

export default BannerManagement;