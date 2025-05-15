import React from "react";
import { Link } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const UserTable = ({ users = [], onDelete }) => {
  // Kiểm tra kiểu dữ liệu users
  if (!Array.isArray(users)) {
    console.error("users props phải là một mảng:", users);
    return (
      <div className="p-4 text-red-500">Dữ liệu người dùng không hợp lệ</div>
    );
  }

  // Hàm xác nhận xóa
  const confirmDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa người dùng này?")) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Tên
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Email
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Vai trò
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-medium">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 px-4 text-center text-gray-400">
                Không có người dùng nào.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user?._id || Math.random()}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{user?.name || "N/A"}</td>
                <td className="py-3 px-4">{user?.email || "N/A"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      user?.role?.name === "admin" // Kiểm tra name của role
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user?.role?.name || "user"} {/* Hiển thị tên role */}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    {/* Nút Xem */}
                    <Tooltip title="Xem chi tiết">
                      <Link
                        to={`/users/${user?._id}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <EyeOutlined className="text-lg" />
                      </Link>
                    </Tooltip>

                    {/* Nút Sửa */}
                    <Tooltip title="Chỉnh sửa">
                      <Link
                        to={`/users/edit/${user?._id}`}
                        className="text-gray-600 hover:text-yellow-600"
                      >
                        <EditOutlined className="text-lg" />
                      </Link>
                    </Tooltip>

                    {/* Nút Xóa */}
                    <Tooltip title="Xóa">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined className="text-lg" />}
                        onClick={() => user?._id && confirmDelete(user._id)}
                        disabled={!user?._id}
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
