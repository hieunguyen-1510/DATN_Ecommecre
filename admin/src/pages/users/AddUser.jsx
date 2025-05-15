import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserForm from "../../components/UserForm";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddUser = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Trong hàm fetchRoles, thêm logging:
const fetchRoles = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/roles`, { 
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`
      } 
    });
    console.log("Roles data:", res.data); // Log dữ liệu nhận được
    setRoles(res.data.data);
  } catch (err) {
    // console.error("Lỗi khi fetch roles:", err.response?.data || err.message);
    setError("Không thể tải danh sách vai trò");
  }
};
    fetchRoles();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await axios.post(`${backendUrl}/api/users`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Thêm người dùng thất bại");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Quay lại
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Thêm người dùng mới</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <UserForm
        roles={roles}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/users")}
      />
    </div>
  );
};

export default AddUser;