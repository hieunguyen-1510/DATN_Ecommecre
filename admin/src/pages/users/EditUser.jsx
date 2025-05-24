import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserForm from "../../components/UserForm";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: null, // Khởi tạo là null thay vì chuỗi rỗng
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const [rolesRes, userRes] = await Promise.all([
          axios.get(`${backendUrl}/api/roles`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${backendUrl}/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        ]);

        setRoles(rolesRes.data.data);
        
        const userData = userRes.data.data;
        setUser({
          name: userData.name,
          email: userData.email,
          role: userData.role?._id || userData.role, 
        });
      } catch (err) {
        setError("Không thể tải dữ liệu");
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // Chỉ gửi các trường thay đổi
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: formData.role // Không cần || null vì backend đã xử lý
      };
      
      console.log("Sending data:", dataToSend); // Debug log
      
      const response = await axios.put(`${backendUrl}/api/users/${id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      console.log("Update response:", response.data); // Debug log
      navigate("/users");
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      "Cập nhật thất bại";
      setError(errorMsg);
      console.error("Update error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Quay lại
      </button>

      <h1 className="text-2xl font-semibold mb-6">Chỉnh sửa người dùng</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <UserForm
        user={user}
        roles={roles}
        onSubmit={handleSubmit}
        isEdit
        error={error}
        loading={loading}
      />
    </div>
  );
};

export default EditUser;