"use client"

import React, { useState,useEffect } from 'react';
import { Layout,  Typography, Drawer, Space, Button } from "antd";
import {  AppstoreAddOutlined } from "@ant-design/icons";
import NavBar from '../../Componants/NavBar';
import useDataEntry from './hooks/useDataEntry';
import DataEntryForm from './components/DataEntryForm';
import ParametersAndUnits from "../(Scopes)/ScopeOne/Activities/parameterAndUnit/page";

import { useScopeOne } from '../(Scopes)/ScopeOne/Context/ScopeOneContext';
const { Content } = Layout;
const { Title, Text } = Typography;
import { useRouter } from 'next/navigation';

const DataEntry = () => {
  const { loading, navigating, handleFormSubmit, SupervisiorName } = useDataEntry();
  const [view, setView] = useState("DataEntry");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [showChat, setShowChat] = useState(false);
  const {getToken} = useScopeOne()
  const router = useRouter()
 

  const onClose = () => {
    setOpen(false);
  };

    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  return (
    <Layout className="data-entry-container">
      <NavBar />
      <Content className="mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="page-header">
            <Title level={2} className="page-title">Data Entry</Title>
          </div>
          {view === "DataEntry" && (
            <DataEntryForm
              loading={loading}
              navigating={navigating}
              handleFormSubmit={handleFormSubmit}
              user_Id={SupervisiorName}
            />
          )}
        </div>
      </Content>
      
    </Layout>
  );
};

export default DataEntry;

