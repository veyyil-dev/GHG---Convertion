"use client";

import { Col, Row, Input, Button, Checkbox, Form, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import loginLogo from "../../../assets/images/loginLogo.png";
import Link from "next/link";

const { Title, Text } = Typography;

export default function Login() {
  const [loadings, setLoadings] = useState([]);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 10000);
  };

  const handleLogin = async (values) => {  //handlelogin
    const { email, password } = values;

    try {
      const response = await fetch(
        "https://ghg-conversion-factors-backend.vercel.app/get_user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("datafromdashboard", data);

      if (response.ok) {
        const { token, user } = data;
        messageApi.success("Login successful!");

        if (token) {
          const expiry = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiry', expiry.toString());
          localStorage.setItem("email", user.email);
          localStorage.setItem("username", user.username);
          localStorage.setItem("firstLogin", "true");
          localStorage.setItem("roles", user.roles);
          localStorage.setItem("SupervisiorName", user.ownername);
          localStorage.setItem("user_paid", user.user_paid);


          router.push("/Route");
        } else {
          alert("Login failed: No token received!");
        }
      } else {
        alert(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="h-screen w-full bg-gradient-to-r from-white to-gray-200 flex items-center justify-center p-4">
        <Row className="w-full max-w-6xl rounded-xl shadow-2xl bg-white flex overflow-hidden">

          {/* Left Section: Image */}
          <Col md={12} xs={0} className="hidden md:flex items-center justify-center bg-gray-100">
            <img
              src={loginLogo.src}
              alt="Login Logo"
              className="h-full w-full object-cover rounded-l-lg"
            />
          </Col>

          {/* Right Section: Form */}
          <Col xs={24} md={12} className="p-10 flex flex-col justify-center bg-white">
            <div className="text-center md:text-left">
              <Title level={3} className="text-gray-900 font-bold">
                Welcome Back!
              </Title>
              <Text className="text-gray-800 text-lg">Sign in</Text>     
            </div>

            <Form
              layout="vertical"
              onFinish={handleLogin}   
              className="mt-6 flex flex-col gap-5"      
            >
              {/* Email Field */}
              <Form.Item
                label={<Text className="text-gray-600">Email</Text>}
                name="email"
                rules={[{ required: true, message: "Please enter your email!" }]}
              >
                <Input className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200" />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label={<Text className="text-gray-600">Password</Text>}
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200" />
              </Form.Item>

              {/* Remember Me & Forgot Password */}
              <Form.Item>
                <div className="flex justify-between items-center">
                
                  <Text className="text-green-500 cursor-pointer hover:underline">
                    Forgot Password?
                  </Text>
                </div>
              </Form.Item>

              {/* Login Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-[#27A376] text-white w-full hover:bg-[#1E8C63] rounded-md shadow-lg footer-for-scopes"
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                >
                  Login
                </Button>
              </Form.Item>

              <Form.Item className="text-center">
                <Text>
                  Don't have an account?{" "}
                  <Link href="/Register" className="text-green-500 hover:underline">
                    Register here
                  </Link>
                </Text>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}
