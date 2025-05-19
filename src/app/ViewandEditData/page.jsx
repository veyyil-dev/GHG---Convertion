"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Layout, Card, Typography } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useScopeOne } from "../(Scopes)/ScopeOne/Context/ScopeOneContext";
import NavBar from "../../Componants/NavBar";

const { Content } = Layout;
const { Title } = Typography;

const DataTable = () => {
  const { data, setData, setUser_Id ,getToken} = useScopeOne();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loadings, setLoadings] = useState([]);
  const [SupervisiorName, setSupervisiorName] = useState(null);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("username");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);


  const getLocalStorageValue = (key) => {
    if (typeof window !== "undefined") {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Error accessing localStorage for key ${key}:`, error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("username");
      const supervisiorName = localStorage.getItem("SupervisiorName");

      if (currentUser) setUser_Id(currentUser);
      if (supervisiorName) setSupervisiorName(supervisiorName);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/api/DashBoardData?userId=${userId}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const fetchedData = await response.json();

      const formattedData = fetchedData.map((row) => ({
        record_date: row.record_date || "",
        key: row.record_id,
        username: row.username || "Unknown",
        date: row.date || "",
        shift: row.shift || "N/A",
        goodsProduced: row.goodsProduced || 0,
        scope1: row.scope1 || 0,
        scope2: row.scope2 || 0,
        co2Emitted: row.co2Emitted || (Number(row.scope1 || 0) + Number(row.scope2 || 0)),
        isSaved: true,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : ""),
    },
    { title: "Shift", dataIndex: "shift", key: "shift" },
    { title: "Goods Produced", dataIndex: "goodsProduced", key: "goodsProduced" },
    { title: "Scope 1", dataIndex: "scope1", key: "scope1" },
    { title: "Scope 2", dataIndex: "scope2", key: "scope2" },
    { title: "CO2 Emitted", dataIndex: "co2Emitted", key: "co2Emitted" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => viewRow(record)}>View</Button>
        </div>
      ),
    },
  ];

  const viewRow = (record) => {
    localStorage.setItem("record_id", record.key);
    localStorage.setItem("template_id", record.record_id);
    router.push("/ViewandEditData/EditData");
  };

  const handleRefresh = async () => {
    setLoadings([true]);
    await fetchData();
    setLoadings([false]);
  };

  return (
    <Layout className="min-h-screen bg-white">
      {SupervisiorName === "N/A" ? <NavBar /> : null}
      <Content className="p-4 sm:p-10">
        <div className="max-w-10xl mx-auto w-[1800] shadow-xl">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 bg-transparent">
            <div onClick={() => router.back()} className="cursor-pointer">
              <ArrowLeftOutlined className="text-2xl" />
            </div>
            <Title level={3} className="!mb-0 !bg-transparent">Data List</Title>
          </div>

          <Card className="custom-card w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loadings[0]}
                className="w-full sm:w-auto"
              >
                {loadings[0] ? "Refreshing..." : "Refresh Data"}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={[...data].sort((a, b) => new Date(b.date) - new Date(a.date))}
                pagination={{ pageSize: 8 }}
                scroll={{ x: "max-content" }}
                className="custom-table"
              />
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default DataTable;
