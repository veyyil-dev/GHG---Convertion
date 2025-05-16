"use client"

import React, { useState } from 'react';
import { Button, message, Steps, theme, Card, Layout } from 'antd';
import ParametersAndUnits from '../../(Scopes)/ScopeOne/Activities/parameterAndUnit/page';
import ParameterUnitForScopeTwo from '../../(Scopes)/Scopetwo/Activities/ParametersUnitForScopeTwo';
import { useRouter } from 'next/navigation';

const { Content } = Layout;

export default function ScopeDataEntry() {
  const [messageApi, messageContextHolder] = message.useMessage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const steps = [
    {
      title: 'Scope 1 Parameters',
      content: <ParametersAndUnits/>,
    },
    
    {
      title: 'Scope 2 Parameters',
      content: <ParameterUnitForScopeTwo/>,
    },
    // {
    //   title: 'Scope 3 Parameters',
    //   content: 'Last-content',
    // },
  ];
  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      messageApi.info("Saving data in 3 seconds...");
  
      // ⏳ Wait for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const DataEnteryLocal = JSON.parse(localStorage.getItem("DataEnteryLocal"));
      const template_id = JSON.parse(localStorage.getItem("templatID"));
  
      const newRow = {
        record_date: DataEnteryLocal.record_date || "",
        username: DataEnteryLocal.username || "Unknown",
        shift: DataEnteryLocal.shift || "",
        goods_produced: DataEnteryLocal.goods_produced || 0,
        goods_unit: DataEnteryLocal.goods_unit || "",
        scope1: DataEnteryLocal.scopeOneTotal || 0,
        scope2: DataEnteryLocal.scopeTwo || 0,
        co2_emitted: Number(DataEnteryLocal.scopeOneTotal || 0) + Number(DataEnteryLocal.scopeTwo || 0),
        template_Id: template_id[0] || "",
      };
  
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/DashBoardData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      messageApi.success("Data saved successfully");
      router.push("/ViewandEditData");
  
    } catch (error) {
      console.error("Error saving data:", error);
      messageApi.error("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setIsLoading(true);
    messageApi.info("Loading Scope 2 in 3 seconds...");
    
    setTimeout(() => {
      setCurrent(current + 1);
      setIsLoading(false);
    }, 3000);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map(item => ({ 
    key: item.title, 
    title: item.title,
    description: `Step ${steps.indexOf(item) + 1}`
  }));

  const contentStyle = {
    minHeight: '500px',
    padding: '24px',
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 24,
  };

  return (
    <Layout className="w-full">
      {messageContextHolder}
      <Content className="p-12">
        <div className="mx-auto">
          <Card className="mb-6">
            <Steps 
              current={current} 
              items={items}
              className="mb-8"
              progressDot
            />
            
            <div style={contentStyle} className="bg-white !h-full !w-full">
              {steps[current].content}
            </div>

            <div className="flex justify-between mt-8">
              <div className="flex gap-4">
                {current > 0 && (
                  <Button 
                    onClick={prev}
                    className="min-w-[100px] footer-for-scopes ml-52"
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                {current < steps.length - 1 ? (
                  <Button 
                    type="primary" 
                    onClick={next}
                    className="min-w-[100px] footer-for-scopes mr-52"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Save and Go to Scope 2
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    onClick={handleSave}
                    className="min-w-[100px] footer-for-scopes mr-52"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                     Save Data
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}