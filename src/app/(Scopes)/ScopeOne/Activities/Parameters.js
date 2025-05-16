import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Button, Checkbox, Radio, message, Spin} from "antd";
import { LoadingOutlined } from "@ant-design/icons"; // Add this import
import { useScopeOne } from "../Context/ScopeOneContext";
import { motion } from "framer-motion";

export default function Parameters() {
  const {
    selectedValuesScopeOne,
    selectedFuels,
    setSelectedFuels,


    fetchedParameters,
    setFetchedParameters,

    
    templatecontent,
    selectedShift,
    // user_id
  } = useScopeOne();

  const [messageApi, contextHolder] = message.useMessage();
  const [userId, setUserId] = useState("");
  const [goodsProduced, setGoodsProduced] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  console.log("Selected Fuels:", selectedFuels);

  // Save selectedFuels to templateDataCreation in localStorage
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
        templateData.selectedFuelsScope1 = selectedFuels;
        
        // Save back to localStorage
        localStorage.setItem("templateDataCreation", JSON.stringify(templateData));
        
        console.log("Updated templateDataCreation with selectedFuels:", templateData);
      } catch (error) {
        console.error("Error updating templateDataCreation:", error);
      }
    }
  }, [selectedFuels]);

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

  const handleSubmit = async () => {
    if (!templatecontent.trim()) {
      messageApi.warning("Please enter a template name.");
      return;
    }

    try {
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/saveScope1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scope: "Scope 1", 
          username: userId, 
          templatecontent, 
          templatesave: selectedFuels, 
          total_goods:goodsProduced,
          goods_units: selectedUnit,
          
        }),
      });

      const data = await response.json();

      if (data.message == false) {  // Check if response is an error
        messageApi.error(data.error); // Show error message
      } else {
        console.log("Scope 1 saved successfully:", data);
        messageApi.success("Scope 1 has been saved");
      }
    } catch (error) {
      console.error("Error saving Scope 1:", error);
      messageApi.error("Failed to save. Please try again.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("email");
      const storedGoodsProduced = localStorage.getItem("goodsProduced");
      const storedUnit = localStorage.getItem("selectedUnit");
      if (storedUserId) {
        setUserId(storedUserId);
      }
     if(storedGoodsProduced){
      setGoodsProduced(storedGoodsProduced);
     }
     if(storedUnit){
      setSelectedUnit(storedUnit);
     }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    setIsLoading(true); // Start loading
    try {
      const scopeFactors = encodeURIComponent(Object.keys(selectedValuesScopeOne));
      console.log("scopeFactors", scopeFactors);
      const activitie = encodeURIComponent(Object.values(selectedValuesScopeOne).flat());
      console.log("activitie", activitie);

      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/parameters?scope=${scopeFactors}&params=${activitie}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setFetchedParameters(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally {
      setIsLoading(false); // Stop loading
    }
  };

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
          delete updatedCategory[item]?.[parameter];

          if (Object.keys(updatedCategory[item] || {}).length === 0) {
            delete updatedCategory[item];
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

  return (
    <>
      {contextHolder} {/* Ant Design Message Context */}
      <div className="flex flex-col h-full justify-between items-center bg-[#EFFBF7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">

        {/* Title */}
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold">Parameters</h1>
        </div>

        {/* Content Wrapper */}
        <div className="w-full flex-grow min-h-[250px] text-[22px] overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Spin indicator={antIcon} />
            </div>
          ) : (
            Object.keys(fetchedParameters).map((category) => (
              <Disclosure key={category}>
                {({ open }) => (
                  <div className="bg-[#BFF1DF] w-full mt-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-lg font-medium text-gray-700 focus:outline-none">
                      <span>{category}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                    </Disclosure.Button>
  
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden">
                      <Disclosure.Panel className="p-4 w-full bg-[#effbf7] rounded-b-lg">
                        {Object.keys(fetchedParameters[category])?.map((item, idx) => (
                          <Disclosure key={idx}>
                            {({ open }) => (
                              <div className="w-full mt-2">
                                <Disclosure.Button className="flex justify-between items-center w-full px-3 py-2 text-gray-600 bg-[#BFF1DF] rounded-md focus:outline-none transition-all duration-300">
                                  <span className="text-base">{item}</span>
                                  <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                                </Disclosure.Button>
  
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                                  <Disclosure.Panel className="p-2 bg-[#effbf7] rounded-md mt-1 text-gray-500">
                                    {Object.keys(fetchedParameters[category][item])?.map((parameter, idx) => (
                                      <div key={`${parameter}-${idx}`} className="flex flex-col p-2 rounded-lg">
                                        <Checkbox checked={selectedFuels[category]?.[item]?.[parameter]?.checked || false} onChange={() => handleClick("checkbox", parameter, item, category)} className="font-semibold text-gray-700">
                                          {parameter}
                                        </Checkbox>
  
                                        {selectedFuels[category]?.[item]?.[parameter]?.checked && (
                                          <Radio.Group className="ml-10 mt-2" value={selectedFuels[category]?.[item]?.[parameter]?.selectedValue} onChange={(e) => handleClick("radio", parameter, item, category, e.target.value)}>
                                            {fetchedParameters[category][item][parameter]?.units.map((unit, radioIdx) => (
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
            ))
          )}
          
        </div>

        {/* Save Button */}
        {/* <div className="w-full flex justify-center mt-auto pt-6">
          <Button onClick={handleSubmit} className="bg-[#91e6c7] text-black font-semibold text-lg py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300">
            Save Template
          </Button>
        </div> */}

      </div>
    </>
  );
}
