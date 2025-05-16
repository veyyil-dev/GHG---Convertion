"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Input, Select, Button, message, notification, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useScopeOne } from "../../Context/ScopeOneContext";

const { Option } = Select;

export default function ParametersAndUnits() {
  const { selectedFuels, setSelectedFuels, setScopeOneTotal, } = useScopeOne();
  const [biogas, setBiogas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();



  // console.log("scopeOneTotal", scopeOneTotal)
  console.log("Selected Fuels:", selectedFuels);

  const totalDataEntryLocal = (scopeOneTotal) => {

    console.log("Scope One ",scopeOneTotal)
    if (typeof window !== "undefined") {
      try {
        // Get existing data from localStorage
        const existingData = localStorage.getItem("DataEnteryLocal");
        // console.log("existingdata",existingData)
        let dataObject = {};
        
        // Parse existing data if it exists
        if (existingData) {
          try {
            dataObject = JSON.parse(existingData);
            // Ensure dataObject is an object
            if (typeof dataObject !== 'object' || dataObject === null) {
              dataObject = {};
              console.log("dataObject",dataObject)
            }
          } catch (parseError) {
            console.error("Error parsing localStorage data:", parseError);
            dataObject = {}; // Reset to empty object if parsing fails
            console.log("dataObjectfiled",dataObject)
          }
        }
        
        // Add the new scopeOneTotal to the object
        if (scopeOneTotal) {
          // Generate a unique key for this entry (using timestamp)
          // const timestamp = new Date().getTime();
          dataObject[`scopeOneTotal`] = scopeOneTotal;
          
          // Save the updated object back to localStorage
          localStorage.setItem("DataEnteryLocal", JSON.stringify(dataObject));
          console.log("Data pushed to localStorage:", dataObject);
        }
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  const dataEntryScope1 = async () => {
    // ✅ Extracting only parameter, maxValue, and selectedValue
    const payload = [];
  
    Object.keys(selectedFuels).forEach((category) => {
      Object.keys(selectedFuels[category]).forEach((item) => {
        Object.keys(selectedFuels[category][item]).forEach((parameter) => {
          const paramData = selectedFuels[category][item][parameter];
  
          if (paramData.checked) {
            payload.push({
              parameter: parameter,                          // Parameter name
              maxValue: paramData.maxValue || "",            // Max value
              selectedValue: paramData.selectedValue || ""   // Selected unit
            });
          }
        });
      });
    }); 


    console.log("Payload to be sent:", payload); // Check the transformed payload
  
    try {
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/DataEntery/Scope1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",   // ✅ Fixed header format
        },
        body: JSON.stringify(payload),          // ✅ Sending only the relevant fields
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data successfully sent:", data);
        setScopeOneTotal(data.ScopeOneTotal)
        totalDataEntryLocal(data.ScopeOneTotal)
        
        
        // api.success({
        //   message: "Success",
        //   description: data.message,
        //   placement:"topLeft"
        // });
      } else {
        console.error("Failed to send data:", response.status);
        // api.error({
        //   message: "Error",
        //   description: "Failed to save data. Please try again.",
        //   placement: "topLeft"
        // });
      }
    } catch (error) {
      console.error("Error in POST request:", error);
      // api.error({
      //   message: "Error",
      //   description: "An error occurred while saving data.",
      //   placement: "topLeft"
      // });
    }
  };
  
  useEffect(() => {
    const fetchBiogasData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://ghg-conversion-factors-backend.vercel.app/biogasData"
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setBiogas(data);
        console.log("Biogas Data:", data);
      } catch (error) {
        console.error("Error fetching biogas data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBiogasData();
  }, []);

  useEffect(() => {
    const templateSave = localStorage.getItem("templateSaves");
    if (templateSave) {
      try {
        const parsedData = JSON.parse(templateSave);
        setSelectedFuels(parsedData[0]);
      } catch (error) {
        console.error("Error parsing template data:", error);
      }
    }
  }, []);

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

  // Create custom spinner icon
  // const antIcon = (
  //   <LoadingOutlined
  //     style={{
  //       fontSize: 40,
  //       color: '#27A376'
  //     }}
  //     spin
  //   />
  // );

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col justify-center items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-lg flex-grow min-h-[515px]">
  //       <div className="flex justify-center items-center h-[200px]">
  //         <Spin indicator={antIcon} />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {contextHolder}
      <div className="flex flex-col h-full justify-between items-center bg-[#EFFBF7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold">Parameters Maximum Value</h1>
        </div>

        <div className="w-full flex-grow min-h-[250px] text-[22px] overflow-auto">
          {Object.keys(selectedFuels).map((category) => (
            <Disclosure key={category} defaultOpen>
              {({ open }) => (
                <div className="bg-[#BFF1DF] w-full mt-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-lg font-medium text-gray-700 focus:outline-none">
                    <span>{category}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                  </Disclosure.Button>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Disclosure.Panel className="p-4 w-full bg-[#effbf7] rounded-b-lg">
                      {Object.keys(selectedFuels[category]).map((item) => (
                        <div key={item} className="bg-[#effbf7] p-3 rounded-lg shadow-sm mb-3">
                          <div className="text-base font-medium text-gray-700 mb-2">{item}</div>
                          <div className="space-y-3">
                            {Object.keys(selectedFuels[category][item])
                              .filter((parameter) => selectedFuels[category][item][parameter]?.checked)
                              .map((parameter) => {
                                const fuelData = biogas.find((b) => b.name === parameter);
                                
                                return (
                                  <div key={parameter} className="bg-[#CBF4E5] p-3 rounded-md">
                                    <div className="text-sm font-medium text-gray-700 mb-2">{parameter}</div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                      {/* Max Value Input */}
                                      <Input
                                        placeholder="Enter max value"
                                        className="w-full sm:w-[344px] border-emerald-400"
                                        value={selectedFuels[category]?.[item]?.[parameter]?.maxValue || ""}
                                        onChange={(e) =>
                                          handleChange(category, item, parameter, "maxValue", e.target.value)
                                        }
                                        onBlur={dataEntryScope1}
                                      />

                                      {/* Unit Selection */}
                                      <Select
                                        className="w-full sm:w-[410px] border-black"
                                        placeholder="Select unit"
                                        value={selectedFuels[category]?.[item]?.[parameter]?.selectedValue || undefined}
                                        onChange={(unit) =>
                                          handleChange(category, item, parameter, "selectedValue", unit)
                                        }
                                        onBlur={dataEntryScope1}
                                      >
                                        {fuelData?.values?.map((unit) => (
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

        {/* <div className="w-full flex justify-center mt-auto pt-6">
          <Button
            onClick={DataEnteryScope1}
            className="bg-[#91e6c7] text-black font-semibold text-lg py-2 px-6 rounded-lg shadow-md hover:bg-green-600 hover:text-white transition-all duration-300"
          >
            Enter Data
          </Button>
        </div> */}
      </div>
    </>
  );
}