"use client";
import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Input, Select, notification, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Option } = Select;

export default function ParameterUnitForScopeTwoEditScopeTwo() {
  const [selectedFuels, setSelectedFuels] = useState({});
  const [scopeData, setScopeData] = useState({});
  const [parameters, setParameters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();

  // Save scopeTwo total data to localStorage
  const TotalDateEntryLocal = (scopeTwoTotal) => {
    if (typeof window === "undefined") return;

    try {
      const existingData = localStorage.getItem("ParameterandUnits");
      let dataObject = existingData ? JSON.parse(existingData) : {};

      if (typeof dataObject !== "object" || dataObject === null) {
        dataObject = {};
      }

      if (scopeTwoTotal) {
        dataObject.scopeTwo = scopeTwoTotal;
        localStorage.setItem("ParameterandUnits", JSON.stringify(dataObject));
        console.log("Scope Two data updated in localStorage:", dataObject);
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Fetch scope data on mount
  useEffect(() => {
    const allentries_id = localStorage.getItem("template_id");
    if (!allentries_id) return;

    const fetchScopeData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/getAllentriesByidGet?allentries_id=${allentries_id}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setScopeData(data);
      } catch (err) {
        console.error("Error fetching scope data:", err);
      }
    };

    fetchScopeData();
  }, []);

  // Fetch parameters on mount
  useEffect(() => {
    const fetchParameters = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://ghg-conversion-factors-backend.vercel.app/getTempnameToEditing/ForEdit?template_id=${localStorage.getItem(
            "template_id"
          )}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Parameters:", data);

        // Assuming data is [parameters, selectedFuels] based on your original usage
        setParameters(data[0] || {});
        setSelectedFuels(data[1] || {});
      } catch (error) {
        console.error("Error fetching parameters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParameters();
  }, []);

  // Handle input/select changes
  const handleChange = (category, item, parameter, field, value) => {
    setSelectedFuels((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: {
          ...prev[category]?.[item],
          [parameter]: {
            ...(prev[category]?.[item]?.[parameter] || {}),
            [field]: value,
          },
        },
      },
    }));
  };

  // Send data on change
  const DataEnteryScope2 = async () => {
    const payload = [];

    if (selectedFuels) {
      Object.keys(selectedFuels).forEach((category) => {
        Object.keys(selectedFuels[category] || {}).forEach((item) => {
          Object.keys(selectedFuels[category][item] || {}).forEach((parameter) => {
            const paramData = selectedFuels[category][item][parameter];
            if (paramData?.checked) {
              payload.push({
                parameter,
                maxValue: paramData.maxValue || "",
                selectedValue: paramData.selectedValue || "",
              });
            }
          });
        });
      });
    }

    console.log("Payload to be sent:", payload);

    try {
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/DataEntery/Scope1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data successfully sent:", data);
        if (data.ScopeOneTotal) {
          TotalDateEntryLocal(data.ScopeOneTotal);
        }
      } else {
        console.error("Failed to send data:", response.status);
      }
    } catch (error) {
      console.error("Error in POST request:", error);
    }
  };

  // Sync scope2 values into selectedFuels
useEffect(() => {
  if (!scopeData.scope2 || !Object.keys(selectedFuels).length) return;

  const updatedFuels = JSON.parse(JSON.stringify(selectedFuels)); // deep clone

  scopeData.scope2.forEach(({ parameter, maxValue, selectedValue }) => {
    for (const category in updatedFuels) {
      for (const item in updatedFuels[category]) {
        if (updatedFuels[category][item][parameter]) {
          updatedFuels[category][item][parameter].maxValue = maxValue;
          updatedFuels[category][item][parameter].selectedValue = selectedValue;
        }
      }
    }
  });

  // Only update if different
  if (JSON.stringify(updatedFuels) !== JSON.stringify(selectedFuels)) {
    setSelectedFuels(updatedFuels);
  }
}, [scopeData.scope2, selectedFuels]);



const antIcon = <LoadingOutlined style={{ fontSize: 40, color: "#27A376" }} spin />;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-lg flex-grow min-h-[515px]">
        <div className="flex justify-center items-center h-[200px]">
          <Spin indicator={antIcon} />
        </div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="flex flex-col h-full justify-between items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-lg flex-grow min-h-[515px]">
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold">Parameters Maximum Value</h1>
        </div>

        <div className="w-full flex-grow min-h-[250px] text-[22px] overflow-auto">
          {selectedFuels &&
            Object.keys(selectedFuels).map((category) => (
              <Disclosure key={category} defaultOpen>
                {({ open }) => (
                  <div className="bg-[#BFF1DF] w-full mt-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-lg font-medium text-gray-700 focus:outline-none">
                      <span>{category}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                      />
                    </Disclosure.Button>

                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <Disclosure.Panel className="p-4 w-full bg-[#effbf7] rounded-b-lg">
                        {selectedFuels[category] &&
                          Object.keys(selectedFuels[category]).map((item) => (
                            <div key={item} className="bg-[#effbf7] p-3 rounded-lg shadow-sm mb-3">
                              <div className="text-base font-medium text-gray-700 mb-2">{item}</div>
                              <div className="space-y-3">
                                {Object.keys(selectedFuels[category][item])
                                  .filter(
                                    (parameter) => selectedFuels[category][item][parameter]?.checked
                                  )
                                  .map((parameter) => {
                                    const units =
                                      parameters?.[category]?.[item]?.[parameter]?.units || [];

                                    return (
                                      <div key={parameter} className="bg-[#CBF4E5] p-3 rounded-md">
                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                          {parameter}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                          <Input
                                            required
                                            placeholder="Enter max value"
                                            className="w-full sm:w-[344px] border-emerald-400"
                                            value={
                                              selectedFuels[category][item][parameter].maxValue || ""
                                            }
                                            onChange={(e) =>
                                              handleChange(
                                                category,
                                                item,
                                                parameter,
                                                "maxValue",
                                                e.target.value
                                              )
                                            }
                                            onBlur={DataEnteryScope2}
                                          />
                                          <Select
                                            className="w-full sm:w-[410px] border-black"
                                            placeholder="Select unit"
                                            value={
                                              selectedFuels[category][item][parameter].selectedValue ||
                                              undefined
                                            }
                                            onChange={(unit) =>
                                              handleChange(
                                                category,
                                                item,
                                                parameter,
                                                "selectedValue",
                                                unit
                                              )
                                            }
                                            onBlur={DataEnteryScope2}
                                          >
                                            {units.map((unit) => (
                                              <Option key={unit} value={unit}>
                                                {unit}
                                              </Option>
                                            ))}
                                          </Select>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ))}
                      </Disclosure.Panel>
                    </motion.div>
                  </div>
                )}
              </Disclosure>
            ))}
        </div>
      </div>
    </>
  );
}
