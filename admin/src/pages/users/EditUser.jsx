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
    role: "",
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesRes = await axios.get(`${backendUrl}/api/roles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRoles(rolesRes.data.data);

        // Fetch user data
        const userRes = await axios.get(`${backendUrl}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Lấy ID role từ user
        setUser({
          name: userRes.data.data.name,
          email: userRes.data.data.email,
          role: userRes.data.data.role, // Lưu ID của role
        });
      } catch (err) {
        setError("Không thể tải dữ liệu");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await axios.put(`${backendUrl}/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật thất bại");
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