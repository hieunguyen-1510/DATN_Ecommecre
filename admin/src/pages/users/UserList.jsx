import React, { useEffect, useState } from "react";
import UserTable from "../../components/UserTable";
import { Link } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/users`);
      // console.log("Users data:", res.data.data); 
      setUsers(res.data.data);
      setError("");
    } catch (err) {
      console.error("Lỗi khi fetch users:", err);
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xoá user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Danh sách người dùng</h1>
        <Link
          to="/users/add"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm người dùng
        </Link>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <UserTable users={users} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default UserList;
