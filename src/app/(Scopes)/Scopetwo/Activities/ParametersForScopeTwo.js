"use client";
import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Button, Checkbox, Radio, message, Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useScopeTwo } from "../Context/ScopeTwoContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ParametersForScopeTwo() {
  const { selectedValuesScopeTwo } = useScopeTwo();
  const [messageApi, contextHolder] = message.useMessage();
  const [userId, setUserId] = useState("");
  const [parameters, setParameters] = useState({});
  const [selectedFuels, setSelectedFuels] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [templatecontent, setTemplatecontent] = useState("");
  const router = useRouter();

  console.log("Selected Fuels:", selectedFuels);

  useEffect(() => {
    if(typeof window !== "undefined" && selectedFuels){
      try {
        // Get existing data from localStorage
        let templateData = {};
        const existingData = localStorage.getItem("templateDataCreation");
        
        if (existingData) {
          templateData = JSON.parse(existingData);
        }
        
        // Update with selectedFuels
        templateData.selectedFuelsScope2 = selectedFuels;
        
        // Save back to localStorage
        localStorage.setItem("templateDataCreation", JSON.stringify(templateData));
        
        console.log("Updated templateDataCreation with selectedFuels:", templateData);
      } catch (error) {
        console.error("Error updating templateDataCreation:", error);
      }
    }
  }, [selectedFuels]);
 

  // Get user email from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("email");
      const storedTemplateContent = localStorage.getItem("templateContent");
      console.log("templatecontent", storedTemplateContent);
      if (storedUserId) {
        setUserId(storedUserId);
      }
      if (storedTemplateContent) {
        try {
          const parsedTemplateContent = JSON.parse(storedTemplateContent);
          setTemplatecontent(parsedTemplateContent);
        } catch (error) {
          console.error("Error parsing template content:", error);
          setTemplatecontent(storedTemplateContent);
        }
      }
    }
  }, []);

  // Fetch parameters from the backend
  useEffect(() => {
    const fetchParameters = async () => {
      setIsLoading(true);
      try {
        const scopeFactors = encodeURIComponent(Object.keys(selectedValuesScopeTwo));
        const activitie = encodeURIComponent(Object.values(selectedValuesScopeTwo).flat());

        console.log("scopeFactors", scopeFactors)
        console.log("activitie", activitie)

        const response = await fetch(
          `https://ghg-conversion-factors-backend.vercel.app/parameters?scope=${scopeFactors}&params=${activitie}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Parameters:", data);
        setParameters(data);
      } catch (error) {
        console.error("Error fetching parameters:", error);
        // Fallback to dummy data if API fail
      } finally {
        setIsLoading(false);
      }
    };

    if (Object.keys(selectedValuesScopeTwo).length > 0) {
      fetchParameters();
    } else {
      setIsLoading(false);
    }
  }, [selectedValuesScopeTwo]);

  const handleClick = (type, parameter, item, category, selectedValue = null) => {
    setSelectedFuels((prev) => {
      let updatedFuels = { ...prev };

      if (type === "checkbox") {
        const isChecked = !prev[category]?.[item]?.[parameter]?.checked;
        if (isChecked) {
          updatedFuels = {
      ...prev,
            [category]: {
              ...prev[category],
              [item]: {
                ...prev[category]?.[item],
                [parameter]: {
                  checked: true,
                  selectedValue: prev[category]?.[item]?.[parameter]?.selectedValue || "",
                },
              },
            },
          };
        } else {
          const updatedCategory = { ...prev[category] };
          if (updatedCategory[item]) {
            delete updatedCategory[item][parameter];
            if (Object.keys(updatedCategory[item]).length === 0) {
              delete updatedCategory[item];
            }
          }
          if (Object.keys(updatedCategory).length === 0) {
            delete updatedFuels[category];
          } else {
            updatedFuels[category] = updatedCategory;
          }
        }
      } else if (type === "radio") {
        if (prev[category]?.[item]?.[parameter]?.checked) {
          updatedFuels[category][item][parameter].selectedValue = selectedValue;
        }
      }

      return updatedFuels;
    });
  };

  const handleSubmit = async () => {
    try {
      // First check if we have data to save
      if (Object.keys(selectedFuels).length === 0) {
        messageApi.warning("Please select at least one parameter");
        return;
      }

      if (!templatecontent.trim()) {
        messageApi.warning("Please enter a template name");
        return;
      }

      // Convert the dictionary to a JSON string
      const templateSaveScope2Json = JSON.stringify(selectedFuels);

      const response = await fetch(
        "https://ghg-conversion-factors-backend.vercel.app/Scope2save",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            scope: "Scope 2", 
            username: userId,
            templatecontent: templatecontent,
            templateSave_scope2: templateSaveScope2Json,
            updated_at: new Date().toISOString()
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        messageApi.success("Scope 2 template saved successfully");
        // Navigate to dashboard after successful save
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000); // Wait for 1 second so user can see the success message
      } else {
        messageApi.error(data.message || "Failed to save template");
      }
    } catch (error) {
      console.error("Error saving Scope 2:", error);
      messageApi.error("Failed to save template. Please try again.");
    }
  };

  // Create custom spinner icon
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 40,
        color: '#27A376'
      }}
      spin
    />
  );

  if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
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
          <h1 className="text-2xl font-bold">Parameters</h1>
          
          {/* <div className="mt-4 mb-6">
            <Input
              placeholder="Enter template name"
              value={templatecontent}
              onChange={(e) => setTemplatecontent(e.target.value)}
              className="w-full max-w-md"
            />
          </div> */}
        </div>

        <div className="w-full flex-grow min-h-[250px] text-[22px] overflow-auto">
          {parameters && Object.keys(parameters).map((category) => (
            <Disclosure key={category}>
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
                      {parameters[category] && Object.keys(parameters[category]).map((item, idx) => (
                      <Disclosure key={idx}>
                        {({ open }) => (
                          <div className="w-full mt-2">
                            <Disclosure.Button className="flex justify-between items-center w-full px-3 py-2 text-gray-600 bg-[#BFF1DF] rounded-md focus:outline-none transition-all duration-300">
                              <span className="text-base">{item}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                            </Disclosure.Button>

                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                            <Disclosure.Panel className="p-2 bg-[#effbf7] rounded-md mt-1 text-gray-500">
                                  {parameters[category][item] && Object.keys(parameters[category][item]).map((parameter, idx) => (
                                    <div key={`${parameter}-${idx}`} className="flex flex-col p-2 rounded-lg">
                                        <Checkbox
                                        checked={selectedFuels[category]?.[item]?.[parameter]?.checked || false}
                                        onChange={() => handleClick("checkbox", parameter, item, category)}
                                          className="font-semibold text-gray-700"
                                      >
                                        {parameter}
                                      </Checkbox>

                                      {selectedFuels[category]?.[item]?.[parameter]?.checked && (
                                        <Radio.Group
                                          className="ml-10 mt-2"
                                          value={selectedFuels[category]?.[item]?.[parameter]?.selectedValue}
                                          onChange={(e) => handleClick("radio", parameter, item, category, e.target.value)}
                                        >
                                          {parameters[category][item][parameter].units.map((unit, radioIdx) => (
                                            <Radio key={`${parameter}-${unit}-${radioIdx}`} value={unit}>
                                                {unit}
                                              </Radio>
                                            ))}
                                          </Radio.Group>
                                        )}
                                      </div>
                                  ))}
                            </Disclosure.Panel>
                              </motion.div>
                          </div>
                        )}
                      </Disclosure>
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
            onClick={handleSubmit}
            className="bg-[#91e6c7] text-black font-semibold text-lg py-2 px-6 rounded-lg shadow-md hover:bg-green-600 hover:text-white transition-all duration-300"
          >
            Save Template
          </Button>
        </div> */}
      </div>
    </>
  );
}