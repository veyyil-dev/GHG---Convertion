"use client";

import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; // Add this import
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useScopeOne } from "../Context/ScopeOneContext";

export default function ChooseActivities() {
  const {
    checkedValuesScopeOne,
    selectedValuesScopeOne,
    setSelectedValuesScopeOne,
    fetchedCheckedValues,
    editTemplate,
  } = useScopeOne();

  const [activities, setActivities] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const debounceSave = useRef(null);

  console.log("fetchedCheckedValues from activity page:", fetchedCheckedValues);
  console.log("From Activities Page - Checked Values:", checkedValuesScopeOne);

  // Fetch available activities based on checked scope factors
  const FetchActivities = async () => {
    setIsLoading(true); // Start loading
    let checkedValuesStr = "";

    if (editTemplate === "Edit" && fetchedCheckedValues?.length > 0) {
      checkedValuesStr = fetchedCheckedValues.map(encodeURIComponent).join(",");
    } else if (checkedValuesScopeOne?.length > 0) {
      checkedValuesStr = checkedValuesScopeOne.map(encodeURIComponent).join(",");
    } else {
      console.log("No checked values, skipping fetch.");
      setIsLoading(false); // Stop loading if no values
      return;
    }

    console.log("Fetching activities for:", checkedValuesStr);

    try {
      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/scope_activities/${checkedValuesStr}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched Activities:", data);

      setActivities(data);
    } catch (error) {
      console.error("Error fetching scope activities:", error);
    }finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  // Handle Checkbox Change (Debounced Save)
  const handleCheckboxChange = (category, item) => {
    setSelectedValuesScopeOne((prev) => {
      const updatedCategoryValues = prev[category] ? [...prev[category]] : [];

      if (updatedCategoryValues.includes(item)) {
        updatedCategoryValues.splice(updatedCategoryValues.indexOf(item), 1);
      } else {
        updatedCategoryValues.push(item);
      }

      const updatedData = { ...prev, [category]: updatedCategoryValues };

      // Debounce API call to avoid excessive requests
      clearTimeout(debounceSave.current);
      // debounceSave.current = setTimeout(() => saveActivitiesToDraft(updatedData), 1000);

      return updatedData;
    });
  };

  useEffect(() => {
    FetchActivities();
  }, [checkedValuesScopeOne, fetchedCheckedValues]); // Fetch new activities when checkboxes change

  // Create custom spinner icon
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 40,
        color: '#27A376' // Using your green theme color
      }}
      spin
    />
  );

  return (
    <div className="flex flex-col justify-center  items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
      {/* Title */}
      <div className="w-full mb-4">
        <h1 className="text-2xl font-black">Activities</h1>
      </div>

      {/* Disclosure Section with Loading State */}
      <div className="w-full min-h-[250px] flex-grow text-[22px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Spin 
              indicator={antIcon}
              size="large"
              tip="Loading activities..."
              className="text-green-600"
            />
          </div>
        ) : (
          Object.keys(activities).map((key) => {
            const shouldDisplay = editTemplate === "Edit"
              ? fetchedCheckedValues.includes(key)
              : checkedValuesScopeOne.includes(key);

            if (!shouldDisplay) return null;

          return (
            <Disclosure key={key}>
              {({ open }) => (
                <div className="bg-[#BFF1DF] w-full mt-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Main Disclosure Button */}
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-lg font-medium text-gray-700 focus:outline-none transition duration-700">
                    <span>{key}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                  </Disclosure.Button>

                  {/* Smoothly Expanding Panel */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <Disclosure.Panel className="p-4 w-full bg-[#effbf7] rounded-b-lg">
                      <div className="flex flex-wrap gap-4">
                        {activities[key].map((item, idx) => (
                          <div key={idx} className="flex items-center">
                            <Checkbox
                              checked={selectedValuesScopeOne[key]?.includes(item) || false}
                              onChange={() => handleCheckboxChange(key, item)}
                            >
                              <span>{item}</span>
                            </Checkbox>
                          </div>
                        ))}
                      </div>
                    </Disclosure.Panel>
                  </motion.div>
                </div>
              )}
            </Disclosure>
          );
        })
      )}
      </div>
    </div>
  );
}
