"use client";

import { useState } from "react";
import { Row, Col, Flex, Popover, Steps, ConfigProvider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function HeaderForScopes({ changeShope ,setChangeShope}) {
  const router = useRouter();
  // Track active scope

  const stepLabels = ["Template Details", "Scope 1", "Scope 2"];

  // Custom popover dot with label
  const customDot = (dot, { status, index }) => (
    <Popover content={<span>{stepLabels[index]}</span>} >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          top: "-3px",
        }}
      >
        {dot}
      </div>
    </Popover>
  );

  const handleScopeClick = (index) => {
    setChangeShope(index);
  };

  return (
    <>
      {/* Header Section */}
      <div
        className="flex justify-center mt-4 sm:mt-10"
        style={{ width: "100%" }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <Row justify="center">
            <Col span={24}>
              <Flex align="center" gap={20} justify="center">
                <ArrowLeftOutlined
                  onClick={() => router.push("/dashboard")}
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom:"10px",
                    boxShadow:"inherit"
                  }}
                />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  Choose Scope Factors and Activities
                </h1>
              </Flex>
            </Col>
          </Row>
        </div>
      </div>

      {/* Scope Selection */}
      <Flex
        justify="center"
        className="w-full md:w-[1000px] lg:w-[1000px] ml-auto mr-auto mt-10 sm:block hidden"
        gap={16}
      >
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          {stepLabels.map((scope, index) => (
            <Col key={index} xs={12} sm={6} md={6} lg={6} xl={6}>
              <div style={{ textAlign: "center" }}>
                <h1
                  className="text-lg sm:text-xl"
                  role="button"
                  tabIndex={0}
                  style={{
                    color: changeShope === index ? "#008D87" : "black",
                  }}
                  onClick={() => handleScopeClick(index)}
                >
                  {scope}
                </h1>
              </div>
            </Col>
          ))}
        </Row>
      </Flex>

      {/* Steps Indicator */}
      <div className="w-full md:w-[1000px] lg:w-[1000px] ml-auto mr-auto mt-10 sm:block hidden">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#27A376",
            },
          }}
        >
          <Steps
            current={changeShope}
            items={stepLabels.map((label) => ({ title: label }))}
            className="w-full md:w-[1000px] lg:w-[1000px] ml-auto mr-auto mt-10"
            progressDot={customDot}
            onChange={(current)=>setChangeShope(current)}
            
          />
        </ConfigProvider>
      </div>
    </>
  );
}
