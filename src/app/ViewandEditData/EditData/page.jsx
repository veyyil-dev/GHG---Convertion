"use client";
import { Layout, Card, Button, Typography } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../../Componants/NavBar";
import EditDataForm from "./components/EditDataForm";
import useFetchEditData from "./hooks/useFetchEditData";
import { useScopeOne } from "../../(Scopes)/ScopeOne/Context/ScopeOneContext";

const { Content } = Layout;
const { Title } = Typography;

const EditDataView = () => {
  const { user_Id, setUser_Id, setScopeOneTotal , getToken } = useScopeOne();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const router = useRouter();

  

  const {
    form,
    loading,
    navigating,
    setNavigating,
    fetchRecordData,
    handleFormSubmit
  } = useFetchEditData({ setUser_Id, setScopeOneTotal, isReadOnly, setIsReadOnly });

  useEffect(() => {
    fetchRecordData();
  }, []);

    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  return (
    <Layout className="data-entry-container">
      <NavBar />
      <Content className="mt-28 max-w-7xl mx-auto w-full fixed top-0 left-0 right-0">
        <div className="page-header flex items-center gap-2 p-1 cursor-pointer">
          <div onClick={() => router.back()}><ArrowLeftOutlined className="text-2xl mb-3" /></div>
          <Title level={2}>View Data</Title>
        </div>

        <Card>
          <div className="flex justify-end mb-4">
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsReadOnly(!isReadOnly)}
              className="custom-button custom-button-primary"
            >
              {isReadOnly ? "Edit Data" : "Cancel Edit"}
            </Button>
          </div>

          <EditDataForm
            form={form}
            isReadOnly={isReadOnly}
            loading={loading}
            navigating={navigating}
            onSubmit={handleFormSubmit}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default EditDataView;
