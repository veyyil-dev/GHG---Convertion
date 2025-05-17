"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Layout,
  Button,
  Typography,
  Drawer,
  Menu,
  Avatar,
  Popover,
  message,
} from "antd";
import {
  MenuOutlined,
  FormOutlined,
  EditOutlined,
  UserOutlined,
  TableOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useScopeOne } from "../app/(Scopes)/ScopeOne/Context/ScopeOneContext";
import "../Componants/css/MenuStyles.css";

const { Header } = Layout;
const { Title } = Typography;

export default function NavBar ()  {
  const { setEditTemplate, userId, user_Id, setUser_Id } = useScopeOne();
  const router = useRouter();
  const pathname = usePathname();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [user, setUser] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userName = localStorage.getItem("username");
      const role = localStorage.getItem("roles");

      if (userName) {
        setUser_Id(userName);
        setUser(userName.charAt(0).toUpperCase());

        const firstLogin = localStorage.getItem("firstLogin");
        if (firstLogin === "true") {
          messageApi.success(`Welcome, ${userName}!`);
          localStorage.removeItem("firstLogin");
        }
      }

      if (role) {
        setRoles(role);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  const handleCreateTemplate = () => {
    setEditTemplate("Create");
    router.push("/ScopeOne");
  };

  const popoverContent = (
    <div className="p-2 text-center">
      <Link href="/Userprofile">
        <p className="mb-2 font-semibold text-gray-700 cursor-pointer">{user_Id}</p>
      </Link>
      <p className="mb-2 font-semibold text-gray-700">{roles}</p>
      <Button
        type="primary"
        danger
        size="small"
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </Button>
    </div>
  );

  return (
    <>
      {contextHolder}
      <Header className="shadow-lg flex items-center justify-between px-6 h-20 bg-white">
        <div className="flex items-center">
          {roles !== "DataEntry" && (
            <button
              onClick={() => setDrawerVisible(true)}
              className="text-xl text-gray-800 hover:bg-gray-100 rounded-full p-2"
            >
              <MenuOutlined />
            </button>
          )}
          <Title level={3} className="mt-2 text-xl font-bold text-gray-800">
            {pathname !== "/dashboard" && roles !== "DataEntry" ? (
              <Link href="/dashboard">
                <span className="text-black">Dashboard</span>
              </Link>
            ) : (
              <span className="text-black">{roles !== "DataEntry" ? "Dashboard" : ""}</span>
            )}
          </Title>
        </div>
        <Popover content={popoverContent} trigger="hover">
          <Avatar
            style={{
              backgroundColor: "#3b82f6",
              verticalAlign: "middle",
              cursor: "pointer",
            }}
            size="large"
            className="text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            {user}
          </Avatar>
        </Popover>
      </Header>

      {/* Left Drawer (Sidebar Menu) */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="bg-white"
        width={250}
      >
        <Menu mode="inline" className="custom-menu">
       

          {pathname !== "/dashboard" && roles !== "DataEntry" && (
            <Menu.Item icon={<DashboardOutlined />}>
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
          )}

          {roles === "Supervisor" && (
            <Menu.Item icon={<FormOutlined />}>
              <a onClick={handleCreateTemplate}>Create Template</a>
            </Menu.Item>
          )}

          <Menu.Item icon={<EditOutlined />}>
            <Link href="/TemplateView">Edit Template</Link>
          </Menu.Item>

          <Menu.Item icon={<TableOutlined />}>
            <Link href="/TemplateSelector">Enter Data</Link>
          </Menu.Item>

          <Menu.Item icon={<CheckCircleOutlined />}>
            <Link href="/ViewandEditData">Edit Data</Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};


