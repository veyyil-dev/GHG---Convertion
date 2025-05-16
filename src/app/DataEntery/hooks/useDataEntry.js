"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import dayjs from "dayjs";
import { useScopeOne } from "../../(Scopes)/ScopeOne/Context/ScopeOneContext";

// Safe localStorage access functions
const getLocalStorageValue = (key) => {
  if (typeof window !== 'undefined') {
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

const setLocalStorageValue = (key, value) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage for key ${key}:`, error);
    }
  }
};

const useDataEntry = () => {
  const { setData, setUser_Id, setScopeOneTotal } = useScopeOne();
  const [templateId, setTemplateId] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const [SupervisiorName, setSupervisiorName] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('username');
      const supervisiorName = localStorage.getItem('username');

      if (currentUser) {
        setUser_Id(currentUser);
      }
      if (supervisiorName) {
        setSupervisiorName(supervisiorName);
      }
      fetchTemplateData();
    }
  }, []);

  const fetchTemplateData = async () => {
    try {
      setLoading(true);
      const userId = getLocalStorageValue('username');
      const templateContent = getLocalStorageValue('templatecontent');

      if (!userId || !templateContent) {
        message.error("Template data not found");
        return;
      }

      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/getTempnameToEditing?username=${userId}&templatecontent=${templateContent[0]}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.entries && data.entries.length > 0) {
        setTemplateData(data.entries[0]);
        setTemplateId(data.entries[0].id);

        setLocalStorageValue('UpdateingTemp', data.entries.map(entry => entry.templatesave));
        setLocalStorageValue('templatecontent', data.entries.map(entry => entry.templatecontent));
        setLocalStorageValue('templateSaves', data.entries.map(entry => entry.templatesave));
        setLocalStorageValue('templatID', data.entries.map(entry => entry.id));
      } else {
        message.error("No entries found for this template");
      }
    } catch (error) {
      console.error("Error fetching template data:", error);
      message.error("Failed to load template data");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);

    setLocalStorageValue('DataEnteryLocal', {
      record_date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : "",
      username: values.username || "Unknown",
      shift: values.shift || "",
      goods_produced: values.goodsProduced || 0,
      goods_unit: values.goodsUnit || "",
    });

    setTimeout(() => {
      setLoading(false);
    }, 1500);

    router.push('/DataEntery/ScopesDataEntrys');
  };

  const fetchData = async () => {
    try {
      const templateId = getLocalStorageValue('templatID');
      if (!templateId || !templateId[0]) {
        console.error('No template ID found');
        return;
      }

      const response = await fetch(`https://ghg-conversion-factors-backend.vercel.app/api/DashBoard?Template_Id=${templateId[0]}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const formattedData = data.map((row) => ({
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
    }
  };

  useEffect(() => {
    const templateId = getLocalStorageValue('templatID');
    if (templateId && templateId[0]) {
      setTemplateId(templateId[0]);
      fetchData();
    }
  }, []);

  return {
    templateId,
    templateData,
    loading,
    navigating,
    handleFormSubmit,
    SupervisiorName
  };
};

export default useDataEntry;