"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../Componants/NavBar";
import { Table } from "antd";
import { useScopeOne } from "../(Scopes)/ScopeOne/Context/ScopeOneContext";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const TableView = () => {
  const {
    editTemplate,
    setEditTemplate,
    allEntries,
    setAllEntries,
    userId,
    setUserId,
    getToken,
  } = useScopeOne();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplatesToDelete, setSelectedTemplatesToDelete] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const router = useRouter();
  const { styles } = useStyle();

  // Fetch template from localStorage
  useEffect(() => {
    const storedTemplate = localStorage.getItem("selectedTemplate");
    if (storedTemplate) setSelectedTemplate(storedTemplate);
  }, []);

  // Fetch userId
  useEffect(() => {
    const storedUserId = localStorage.getItem("email");
    const SupervisiorName = localStorage.getItem("SupervisiorName");
    setUserId(SupervisiorName !== "N/A" ? SupervisiorName : storedUserId);
  }, []);

  // Redirect if no token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch entries
  useEffect(() => {
    const fetchAllEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        const username = localStorage.getItem("username");
        const response = await fetch(
          `https://ghg-conversion-factors-backend.vercel.app/getAllEntries?userName=${username}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const entries = data.entries || [];
        setAllEntries(entries);
        setTemplates(entries);
        if (!entries.length) setError("No entries found");
      } catch (error) {
        console.error("Error fetching entries:", error);
        setError("Failed to load entries. Please try again later.");
        setAllEntries([]);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEntries();
  }, []);

  const goToUpdateParameter = (record) => {
    setEditTemplate("Edit");
    localStorage.setItem("UpdatingTemp", JSON.stringify(record.templatesave));
    localStorage.setItem("templateContent", JSON.stringify(record.templatecontent));
    localStorage.setItem("selectedShift", JSON.stringify(record.shift));
    localStorage.setItem("templateID", JSON.stringify(record.id));
    localStorage.setItem("isDraft", "true");
    router.push("/ScopeOne");
  };

  const handleDeleteTemplates = async () => {
    if (selectedTemplatesToDelete.length === 0) {
      alert("Please select templates to delete");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete the selected templates? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "https://ghg-conversion-factors-backend.vercel.app/deleteTemplates",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userId,
            templates: selectedTemplatesToDelete,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Templates deleted successfully!");
        setTemplates((prev) =>
          prev.filter((t) => !selectedTemplatesToDelete.includes(t.templatecontent))
        );
        setAllEntries((prev) =>
          prev.filter((t) => !selectedTemplatesToDelete.includes(t.templatecontent))
        );
        setSelectedTemplatesToDelete([]);
        setShowCheckboxes(false);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting templates:", error);
      alert("An error occurred while deleting the templates.");
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedTemplatesToDelete,
    onChange: (selectedRowKeys) => {
      setSelectedTemplatesToDelete(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: false,
    }),
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "username",
      key: "username",
      fixed: "left",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Template Name",
      dataIndex: "templatecontent",
      key: "templatecontent",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    { title: "Created Date", dataIndex: "created_date", key: "created_date" },
    { title: "Modified Date", dataIndex: "modified_date", key: "modified_date" },
    { title: "Modified By", dataIndex: "modifiedBy", key: "modifiedBy" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) =>
        userId !== "SupervisiorName" && (
          <button
            onClick={() => goToUpdateParameter(record)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-10xl max-h-12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Templates Overview</h2>

          {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowCheckboxes((prev) => !prev)}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              {showCheckboxes ? "Cancel Selection" : "Select Templates to Delete"}
            </button>

            {showCheckboxes && (
              <button
                onClick={handleDeleteTemplates}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Selected
              </button>
            )}
          </div>

          <Table
            className={styles.customTable}
            columns={columns}
            dataSource={templates.map((entry, index) => ({
              ...entry,
              key: entry.templatecontent || index,
            }))}
            loading={loading}
            rowSelection={showCheckboxes ? rowSelection : undefined}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </div>
      </div>
    </div>
  );
};

export default TableView;
