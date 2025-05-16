"use client";

import { Col, Row, Input, Button, Form, Typography, message } from "antd";
import { useState } from "react";
import Link from "next/link";
import loginLogo from "../../../assets/images/loginLogo.png";

const { Title, Text } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const enterLoading = (index) => {
    setLoadings((prev) => {
      const newLoadings = [...prev];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prev) => {
        const newLoadings = [...prev];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };

  const onFinish = (values) => {
    const { username, email, password, confirmPassword } = values;

    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, msg]) =>
        form.setFields([{ name: field, errors: [msg] }])
      );
      return;
    }

    messageApi.success("Registered successfully!");
    // API logic here
  };

  return (
    <>
      {contextHolder}
      <div className="h-screen w-full bg-gradient-to-r from-white to-gray-200 flex items-center justify-center p-4">
        <Row className="w-[2000] max-w-6xl rounded-xl shadow-2xl bg-white flex overflow-hidden">

          {/* Left: Image */}
          <Col md={12} xs={0} className="hidden md:flex items-center justify-center bg-gray-100">
            <img
              src={loginLogo.src}
              alt="Register Logo"
              className="h-full w-full object-cover rounded-l-lg"
            />
          </Col>

          {/* Right: Form */}
          <Col xs={22} md={12} className="p-10 flex flex-col justify-center bg-white">
            <div className="text-center md:text-left">
              <Title level={3} className="text-gray-900 font-bold">
                Create an Account
              </Title>
              <Text className="text-gray-800 text-lg">Sign up</Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="mt-6 flex flex-col gap-5"
            >
              <Form.Item
                label={<Text className="text-gray-600">Username</Text>}
                name="username"
                rules={[{ required: true, message: "Please enter your username!" }]}
              >
                <Input className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200" />
              </Form.Item>

              <Form.Item
                label={<Text className="text-gray-600">Email</Text>}
                name="email"
                rules={[{ required: true, message: "Please enter your email!" }]}
              >
                <Input className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200" />
              </Form.Item>

              <Form.Item
                label={<Text className="text-gray-600">Password</Text>}
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200" />
              </Form.Item>

              <Form.Item
                label={<Text className="text-gray-600">Confirm Password</Text>}
                name="confirmPassword"
                rules={[{ required: true, message: "Please confirm your password!" }]}
              >
                <Input.Password className="rounded-md border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-[#27A376] text-white w-full hover:bg-[#1E8C63] rounded-md shadow-lg footer-for-scopes"
                  loading={loadings[0]}
                  onClick={() => enterLoading(0)}
                >
                  Register
                </Button>
              </Form.Item>

              <Form.Item className="text-center">
                <Text>
                  Already have an account?{" "}
                  <Link href="/login" className="text-green-500 hover:underline">
                    Login here
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
