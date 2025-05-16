"use client";

import React, { useState } from "react";
import { Button, message, Steps, theme, Card, Layout, Popover } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import ParametersAndUnitsEdit from "../ParametersAndUnitsEdit/ParametersAndUnitsEditScopeOne";
import ParameterUnitForScopeTwoEditScopeTwo from "../ParametersAndUnitsEdit/ParametersAndUnitEditScopeTwo";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function ScopeDataEntry() {
  const [messageApi, messageContextHolder] = message.useMessage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Scope 1 Parameters",
      content: <ParametersAndUnitsEdit />,
    },
    {
      title: "Scope 2 Parameters",
      content: <ParameterUnitForScopeTwoEditScopeTwo />,
    },
  ];

  const customDot = (dot, { index }) => (
    <Popover content={<span>{steps[index].title}</span>}>
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#27A376", // Green dot color
          position: "relative",
          top: "-3px",
        }}
      >
        {/* optional: use dot here if you want inner dot like step number */}
      </div>
    </Popover>
  );

  const handleDone = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const DataEnteryLocal = JSON.parse(localStorage.getItem("ParameterandUnits") || "{}");
      const template_id = JSON.parse(localStorage.getItem("template_id") || "[]");
      const record_id = JSON.parse(localStorage.getItem("record_id") || "null");

      if (!record_id) throw new Error("Record ID not found. Cannot update data.");

      const newRow = {
        record_date: DataEnteryLocal.record_date || "",
        username: DataEnteryLocal.username || "Unknown",
        shift: DataEnteryLocal.shift || "",
        goods_produced: DataEnteryLocal.goods_produced || 0,
        goods_unit: DataEnteryLocal.goods_unit || "",
        scope1: DataEnteryLocal.scopeOneTotal || 0,
        scope2: DataEnteryLocal.scopeTwo || 0,
        co2_emitted:
          Number(DataEnteryLocal.scopeOneTotal || 0) + Number(DataEnteryLocal.scopeTwo || 0),
        template_id: template_id || "",
      };

      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/DashBoardData/Update/${record_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRow),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! Status: ${response.status}. ${errorData.error || ""}`);
      }

      messageApi.success("Data Updated successfully");
      localStorage.removeItem("ParameterandUnits");
      localStorage.removeItem("templatID");
      localStorage.removeItem("record_id");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating data:", error);
      messageApi.error(`Failed to update data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelayedSubmit = () => {
    messageApi.info("Submitting data in 3 seconds...");
    setTimeout(() => {
      handleDone();
    }, 3000);
  };

  const { token } = theme.useToken();

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    description: `Step ${steps.indexOf(item) + 1}`,
  }));

  const contentStyle = {
    height: "400px", // 👈 Set a fixed height for the scroll area
    overflowY: "auto", // 👈 Enable vertical scroll
    padding: "24px",
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 24,
  };
  

  return (
    <Layout className="">
      {messageContextHolder}
      <Content className="">
        <div className="mx-auto">
          <Card className="p-1">
            <Steps
              current={current}
              items={items}
              className="mt-7 rounded-2xl p-1"
              progressDot={customDot}
            />

            <div style={contentStyle} className="bg-white !h-[800] !w-full">
              {steps[current].content}
            </div>

            <div className="flex justify-between mt-8">
              <div className="flex gap-4">
                {current > 0 && (
                  <Button onClick={prev} className="min-w-[100px] footer-for-scopes ml-52">
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                {current < steps.length - 1 ? (
                  <Button
                    type="success"
                    onClick={next}
                    className="min-w-[100px] bg-green footer-for-scopes mr-52"
                  >
                    Save and Go to Scope 2 <ArrowRightOutlined /> 
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleDelayedSubmit}
                    className="min-w-[100px] footer-for-scopes mr-52"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Update Data
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </Content>

      {current >= 1 && (
  <style jsx global>{`
    .ant-steps-item-finish .ant-steps-item-tail::after {
      background-color: #27A376 !important;
    }
    .ant-steps-item-process .ant-steps-item-tail::after {
      background-color: #27A376 !important;
    }
  `}</style>
)}

    </Layout>
  );
}
