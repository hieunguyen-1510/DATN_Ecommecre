import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserForm from "../../components/UserForm";
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddUser = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch danh sách roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/roles`, { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`
          } 
        });
        setRoles(res.data.data);
      } catch (err) {
        toast.error("Không thể tải danh sách vai trò", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Fetch roles error:", err.response?.data || err.message);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Đang tạo người dùng...", {
      position: "top-right"
    });

    try {
      await axios.post(`${backendUrl}/api/users`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.update(toastId, {
        render: "🎉 Tạo người dùng thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate("/users"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Thêm người dùng thất bại";
      
      toast.update(toastId, {
        render: `❌ ${errorMsg}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      console.error("Create user error:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Thêm người dùng mới</h1>

      <UserForm
        roles={roles}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/users")}
        loading={isSubmitting}
      />
    </div>
  );
};

export default AddUser;