import React, { useEffect, useState } from "react";
import {Button, Input,Form,Typography,Checkbox,notification,} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";

const { Title } = Typography;

const Login = ({ setToken }) => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/admin`, values);

      if (data.success) {
        setToken(data.token);
        // luu token vao checkbox
        if(rememberMe) {
          localStorage.setItem("token", data.token); // luu token
        }
        else {
          sessionStorage.setItem("token", data.token); // luu tam thoi 
        }
        // luu user name
        localStorage.setItem("username", data.name);
        notification.success({
          message: `Đăng nhập thành công!`,
          description: `Chào ${data.name}`,
        });

        navigate("/statistics");
      } else {
        notification.error({ message: data.message });
      }
    } catch (error) {
      notification.error({
        message: "Đã xảy ra lỗi",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if(savedToken) {
      setToken(savedToken);
      navigate('/login');
    }
  },[]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url('https://t4.ftcdn.net/jpg/02/55/77/03/360_F_255770374_rbmJO9gkkIhMBcyVPc3iW016BCLDvcWc.jpg')` }}
    >
      {/* Overlay mờ nền */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Form Login */}
      <div className="relative z-10 p-8 bg-white/10 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <img
            src="https://www.shutterstock.com/image-vector/user-icon-vector-260nw-429103831.jpg"
            alt="Admin Logo"
            className="w-16 h-16 mx-auto mb-2"
          />
          <Title level={3} className="text-white !mb-0">
            Admin Login
          </Title>
        </div>

        <Form layout="vertical" onFinish={onSubmitHandler} className="text-white">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="admin@email.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Checkbox className="text-white"
            checked = {rememberMe} onChange={(e)=>setRememberMe(e.target.checked)}
            >Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              style={{
                backgroundColor: "#1F1F1F",
                border: "none",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1F1F1F")}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-gray-300 hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
