import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const useFetchEditData = ({ setUser_Id, setScopeOneTotal, isReadOnly, setIsReadOnly }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

  const fetchRecordData = async () => {
    try {
      setLoading(true);
      const recordId = localStorage.getItem("record_id");
      if (!recordId) return message.error("No record ID found");

      const response = await fetch(`https://ghg-conversion-factors-backend.vercel.app/api/DashBoardData/Edit/${recordId}`);
      if (!response.ok) throw new Error("Fetch failed");

      const recordData = await response.json();
      localStorage.setItem("template_id", recordData.template_id || "");

      form.setFieldsValue({
        username: recordData.username,
        date: recordData.record_date ? dayjs(recordData.record_date) : null,
        shift: recordData.shift,
        goodsProduced: recordData.goods_produced,
        goodsUnit: recordData.goods_unit
      });

      setUser_Id(recordData.username);
      if (recordData.scope1) setScopeOneTotal(recordData.scope1);

    } catch (error) {
      console.error(error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const newRow = {
      record_date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : "",
      username: values.username,
      shift: values.shift,
      goods_produced: values.goodsProduced,
      goods_unit: values.goodsUnit
    };

    localStorage.setItem("ParameterandUnits", JSON.stringify(newRow));
    setIsReadOnly(true);
    setNavigating(true);
    message.loading("Navigating to Scope One...", 0);
    setTimeout(() => {
      router.push('/ViewandEditData/EditData/ParameterAndUnitsSteps');
    }, 1500);
  };

  return {
    form,
    loading,
    navigating,
    setNavigating,
    fetchRecordData,
    handleFormSubmit
  };
};

export default useFetchEditData;
