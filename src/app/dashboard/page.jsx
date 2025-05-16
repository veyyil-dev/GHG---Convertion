"use client";
import React, { useState, useRef,useEffect } from 'react'; // Import useRef
import { Layout, DatePicker, Select, Spin, Button, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import dayjs from 'dayjs';
import ChatBot from '../ChatBot/page';
import { useScopeOne } from '../(Scopes)/ScopeOne/Context/ScopeOneContext';
import useDashboardData from './components/hooks/useDashboardData';
import StatsCard from './components/StatsCard';
import ZoomableChartModal from './components/ZoomableChartModal';
import DailyBarChart from './components/DailyBarChart';
import CumulativeLineChart from './components/CumulativeLineChart';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import NavBar from "../../Componants/NavBar"





const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 40, color: "#27A376" }} spin />;
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

const Dashboard = () => {
  const dashboardRef = useRef(null); // Create a ref for the dashboard content
  const { data: rawData, isLoading, refetch } = useDashboardData();
  const { getToken } = useScopeOne();

  const [dateRange, setDateRange] = useState([dayjs().startOf("month"), dayjs().endOf("month")]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedShift, setSelectedShift] = useState("both");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

 
  const filteredData = rawData.filter((item) => {
    const itemDate = dayjs(item.date);
    return itemDate.isAfter(dateRange[0].subtract(1, "day")) && itemDate.isBefore(dateRange[1].add(1, "day"));
  });

  const totalGoods = filteredData.reduce((sum, item) => sum + item.goodsProduced, 0);
  const totalCO2 = filteredData.reduce((sum, item) => sum + item.co2Emitted, 0);
  const totalScope1 = filteredData.reduce((sum, item) => sum + item.scope1, 0);
  const totalScope2 = filteredData.reduce((sum, item) => sum + item.scope2, 0);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates || [dayjs().startOf("month"), dayjs().endOf("month")]);
  };

  const showModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
  };

  const downloadCSV = (data) => {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = async () => {
    if (!dashboardRef.current) {
      return;
    }

    const element = dashboardRef.current;
    const canvas = await html2canvas(element, {
      useCORS: true, // Important for handling images from different origins
      scale: 2,      // Increase scale for better resolution (optional)
    });
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'p' for portrait
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('co2_emission_dashboard.pdf');
  };

  return (
    <Layout className="bg-gray-50">
      <NavBar />
      <Content className="p-6" ref={dashboardRef}> {/* Attach the ref here */}
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-2xl font-bold text-gray-800 mb-6">
          CO₂ Emission Dashboard
        </motion.h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-[500px]">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-between mb-8">
              <div className="flex justify-start mb-8">
                <RangePicker
                  className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:border-blue-600 transition duration-300"
                  defaultValue={dateRange}
                  onChange={handleDateRangeChange}
                  allowClear
                />
              </div>

              <div>
                <Button onClick={() => downloadCSV(filteredData)}>Download CSV</Button>
                <Button className="ml-2" onClick={downloadPDF}>Download PDF</Button> {/* Add the PDF download button */}
              </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Goods Produced"
                value={totalGoods}
                chartData={rawData}
                dataKey="goodsProduced"
                chartColor="#7625F5"
                onClick={() => showModal({ key: "goodsProduced", title: "Total Goods Produced", chartColor: "#7625F5" })}
              />
              <StatsCard
                title="Total CO₂ Emitted (kg)"
                value={totalCO2}
                chartData={rawData}
                dataKey="co2Emitted"
                chartColor="#F56B62"
                onClick={() => showModal({ key: "co2Emitted", title: "Total CO₂ Emitted (kg)", chartColor: "#F56B62" })}
              />
              <StatsCard
                title="Scope 1 Emissions"
                value={totalScope1}
                chartData={rawData}
                dataKey="scope1"
                chartColor="#F5DB06"
                onClick={() => showModal({ key: "scope1", title: "Scope 1 Emissions", chartColor: "#F5DB06" })}
              />
              <StatsCard
                title="Scope 2 Emissions"
                value={totalScope2}
                chartData={rawData}
                dataKey="scope2"
                chartColor="#F5DB06"
                onClick={() => showModal({ key: "scope2", title: "Scope 2 Emissions", chartColor: "#F5DB06" })}
              />
            </motion.div>

            <ZoomableChartModal
              isOpen={isModalVisible}
              onClose={handleCancelModal}
              title={selectedItem?.title || ""}
              data={rawData}
              dataKey={selectedItem?.key || ""}
              chartColor={selectedItem?.chartColor || ""}
            />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex justify-end mb-4">
              <Select className="w-40" value={selectedShift} onChange={setSelectedShift}>
                <Option value="shift1">Shift 1</Option>
                <Option value="shift2">Shift 2</Option>
                <Option value="both">Both</Option>
              </Select>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <div className="flex flex-col lg:flex-row gap-6">
                <DailyBarChart data={filteredData} selectedShift={selectedShift} />
                <CumulativeLineChart data={filteredData} selectedShift={selectedShift} />
              </div>
            </motion.div>
          </>
        )}

        {/* <button
          onClick={() => setShowChat((prev) => !prev)}
          className="fixed bottom-6 right-6 bg-purple-600 mr-10 mb-5 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        {showChat && (
          <div className="fixed bottom-20 right-6 w-[90vw] max-w-md z-50">
            <ChatBot></ChatBot>
          </div>
        )} */}
      </Content>
    </Layout>
  );
};

export default Dashboard;