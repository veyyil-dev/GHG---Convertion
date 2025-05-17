import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Button, Checkbox, Radio, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useScopeOne } from "../Context/ScopeOneContext";
import { AnimatePresence, motion } from "framer-motion";


export default function Parameters() {
  const {
    selectedValuesScopeOne,
    selectedFuels,
    setSelectedFuels,
    fetchedParameters,
    setFetchedParameters,
    setSelectedValuesScopeOne,
    templatecontent,
    checkedValuesScopeOne,
    fetchedCheckedValues,
    editTemplate,
  } = useScopeOne();

  const [messageApi, contextHolder] = message.useMessage();
  const [userId, setUserId] = useState("");
  const [goodsProduced, setGoodsProduced] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const antIcon = <LoadingOutlined style={{ fontSize: 40, color: '#27A376' }} spin />;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("email") || "");
      setGoodsProduced(localStorage.getItem("goodsProduced") || "");
      setSelectedUnit(localStorage.getItem("selectedUnit") || "");
    }
  }, []);

  useEffect(() => {
    const shouldFetch =
      (editTemplate === "Edit" && fetchedCheckedValues?.length > 0) ||
      checkedValuesScopeOne?.length > 0;

    if (!shouldFetch) return;

    const fetchActivities = async () => {
      setIsLoading(true);
      let checkedValuesStr = "";

      if (editTemplate === "Edit" && fetchedCheckedValues?.length > 0) {
        checkedValuesStr = fetchedCheckedValues.map(encodeURIComponent).join(",");
      } else if (checkedValuesScopeOne?.length > 0) {
        checkedValuesStr = checkedValuesScopeOne.map(encodeURIComponent).join(",");
      }

      try {
        const response = await fetch(
          `https://ghg-conversion-factors-backend.vercel.app/scope_activities/${checkedValuesStr}`
        );
        const data = await response.json();
        const autoChecked = {};
        Object.entries(data).forEach(([category, items]) => {
          autoChecked[category] = items;
        });
        setSelectedValuesScopeOne(autoChecked);
      } catch (error) {
        console.error("Error fetching scope activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [checkedValuesScopeOne, fetchedCheckedValues, editTemplate]);

  useEffect(() => {
    if (userId) fetchParameters();
  }, [userId, selectedValuesScopeOne]);

  const fetchParameters = async () => {
    const scopeFactors = Object.keys(selectedValuesScopeOne);
    const activitie = Object.values(selectedValuesScopeOne).flat();

    if (!scopeFactors.length || !activitie.length) return;

    setIsLoading(true);
    try {
      const scopeParam = encodeURIComponent(scopeFactors);
      const activityParam = encodeURIComponent(activitie);
      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/parameters?scope=${scopeParam}&params=${activityParam}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setFetchedParameters(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && selectedFuels) {
      try {
        const existing = JSON.parse(localStorage.getItem("templateDataCreation") || "{}");
        existing.selectedFuelsScope1 = selectedFuels;
        localStorage.setItem("templateDataCreation", JSON.stringify(existing));
      } catch (error) {
        console.error("Error updating templateDataCreation:", error);
      }
    }
  }, [selectedFuels]);

  const handleClick = (type, parameter, item, category, selectedValue = null) => {
    setSelectedFuels((prev) => {
      const updated = { ...prev };

      if (type === "checkbox") {
        const isChecked = !prev[category]?.[item]?.[parameter]?.checked;
        if (isChecked) {
          updated[category] = {
            ...prev[category],
            [item]: {
              ...prev[category]?.[item],
              [parameter]: {
                checked: true,
                selectedValue: prev[category]?.[item]?.[parameter]?.selectedValue || "",
              },
            },
          };
        } else {
          delete updated[category]?.[item]?.[parameter];
          if (Object.keys(updated[category]?.[item] || {}).length === 0) delete updated[category][item];
          if (Object.keys(updated[category] || {}).length === 0) delete updated[category];
        }
      }

      if (type === "radio" && prev[category]?.[item]?.[parameter]?.checked) {
        updated[category][item][parameter].selectedValue = selectedValue;
      }

      return updated;
    });
  };

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
          total_goods: goodsProduced,
          goods_units: selectedUnit,
        }),
      });

      const data = await response.json();
      if (data.message === false) {
        messageApi.error(data.error);
      } else {
        messageApi.success("Scope 1 has been saved");
      }
    } catch (error) {
      console.error("Error saving Scope 1:", error);
      messageApi.error("Failed to save. Please try again.");
    }
  };

  const renderParameter = (parameter, item, category) => (
    <div key={parameter} className="flex flex-col p-2 rounded-lg">
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
          value={selectedFuels[category][item][parameter].selectedValue}
          onChange={(e) => handleClick("radio", parameter, item, category, e.target.value)}
        >
          {fetchedParameters?.[category]?.[item]?.[parameter]?.units?.map((unit, i) => (
            <Radio key={`${parameter}-${unit}-${i}`} value={unit}>
              {unit}
            </Radio>
          ))}
        </Radio.Group>
      )}
    </div>
  );

  return (
     <>
      {contextHolder}
      <div className="flex flex-col h-full justify-between items-center bg-[#EFFBF7] w-full md:w-[768px] lg:w-[1152px] mx-auto mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold">Parameters</h1>
        </div>

        <div className="w-full flex-grow min-h-[250px] text-[22px] overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Spin indicator={antIcon} />
            </div>
          ) : (
            Object.entries(fetchedParameters).map(([category, items]) => (
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
                        {Object.entries(items).map(([item, params]) => (
                          <Disclosure key={item}>
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
                                    {Object.keys(params).map(parameter =>
                                      renderParameter(parameter, item, category)
                                    )}
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

        {/* Save Button (optional, uncomment if needed) */}
        {/* <div className="w-full flex justify-center mt-auto pt-6">
          <Button type="primary" className="bg-[#91e6c7]" onClick={handleSubmit}>
            Save Scope 1
          </Button>
        </div> */}
      </div>
    </>
  );
}
