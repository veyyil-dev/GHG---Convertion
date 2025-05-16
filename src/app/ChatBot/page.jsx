"use client";

import React, { useEffect, useRef, useState, forwardRef } from "react";
import { Send, Bot, User, Download } from "lucide-react";
import { DatePicker, Table, Input } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";

const ChatBot = forwardRef((_, ref) => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you.", isBot: true },
  ]);
  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    amount: 0,
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStartDateChange = (date) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prev) => ({ ...prev, endDate: date }));
  };

  const handleAmountChange = (e) => {
    const amount = Number(e.target.value);
    setFormData((prev) => ({ ...prev, amount }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate, amount } = formData;

    if (!startDate && !endDate && !amount) return;

    let userMessageText = "";
    let botMessageText = "Thanks! Here is your submission:\n";

    if (startDate) {
      const formatted = startDate.format("DD-MM-YYYY");
      userMessageText += `Start Date: ${formatted}\n`;
      botMessageText += `• Start Date: ${formatted}\n`;
    }

    if (endDate) {
      const formatted = endDate.format("DD-MM-YYYY");
      userMessageText += `End Date: ${formatted}\n`;
      botMessageText += `• End Date: ${formatted}\n`;
    }

    if (amount) {
      userMessageText += `Amount: $${amount}`;
      botMessageText += `• Amount: $${amount}`;
    }

    setMessages((prev) => [
      ...prev,
      { text: userMessageText.trim(), isBot: false },
      { text: botMessageText.trim(), isBot: true },
    ]);

    try {
      const startStr = startDate?.format("DD-MM-YYYY");
      const endStr = endDate?.format("DD-MM-YYYY");

      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/api/report?start=${startStr}&end=${endStr}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      setCsvData(data);

      const tableMessage = {
        text: "Here is your report:",
        isBot: true,
        table: (
          <div className="space-y-2">
            <Table
              columns={[
                { title: "Date", dataIndex: "record_date", key: "record_date" },
                { title: "Scope 1", dataIndex: "scope1", key: "scope1" },
                { title: "Scope 2", dataIndex: "scope2", key: "scope2" },
                {
                  title: "CO2 Emitted",
                  dataIndex: "co2_emitted",
                  key: "co2_emitted",
                },
              ]}
              dataSource={data.map((row, i) => ({ ...row, key: i }))}
              pagination={false}
              size="small"
            />
            <button
              onClick={() => downloadCSV(data)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        ),
      };

      setMessages((prev) => [...prev, tableMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Failed to fetch report. Please try again.", isBot: true },
      ]);
    }

    setFormData({ startDate: null, endDate: null, amount: 0 });
  };

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br p-4 flex items-center justify-center"
    >
      <div className="w-[2000] max-w-2xl mb-10 bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-purple-600 p-4 text-white flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Input Assistant</h1>
        </div>

        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                message.isBot ? "" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot ? "bg-purple-100" : "bg-blue-100"
                }`}
              >
                {message.isBot ? (
                  <Bot className="w-5 h-5 text-purple-600" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isBot
                    ? "bg-gray-100 text-gray-800"
                    : "bg-purple-600 text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                {message.table && message.table}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker
                value={formData.startDate}
                onChange={handleStartDateChange}
                className="w-full"
                format="DD-MM-YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <DatePicker
                value={formData.endDate}
                onChange={handleEndDateChange}
                className="w-full"
                format="DD-MM-YYYY"
              />
            </div>
          </div>
          <div>
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
});

export default ChatBot;
