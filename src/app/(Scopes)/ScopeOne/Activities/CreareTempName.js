"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useScopeOne } from "../Context/ScopeOneContext";
import { notification } from "antd";

export default function CreateTempName() {
  const {
    templatecontent,
    settemplatecontent,
    setSelectedShift,
    editTemplate,
  } = useScopeOne();

  // const [goodsProduced, setGoodsProduced] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const autoSaveTimerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load data from localStorage on component mount

  // Function to handle auto-saving data


  // Clean up timer on component unmount


  // Function to save data to localStorage
  const saveToLocalStorage = () => {
    try {
      // Create a single object with all the data
      const templateData = {
        templateContent: templatecontent,
        templateUnit: selectedUnit
      };
      
      // Save the entire object as a single item in localStorage
      localStorage.setItem("templateDataCreation", JSON.stringify(templateData));
      
      // Show notification that data was auto-saved
      
      console.log("Template data saved to localStorage:", templateData);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Handle template name change
  const handleTemplateNameChange = (e) => {
    setIsTyping(true);
    settemplatecontent(e.target.value);
  };

  // Handle unit change
  const handleUnitChange = (e) => {
    setIsTyping(true);
    setSelectedUnit(e.target.value);
  };
  

  return (
    <>
      {contextHolder}
      <div className="flex flex-col justify-center  items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
        <h1 className="text-[20px] md:text-[22px] lg:text-[23px] font-black">
          ENTER TEMPLATE DETAILS
        </h1>
  

        <div className="w-full">
          <label className="block text-gray-800 text-lg font-bold mb-2 text-left">
            Template Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            value={templatecontent || ""}
            onChange={handleTemplateNameChange}
            placeholder="Enter template name"
            onBlur={saveToLocalStorage}
          />
        </div>


        <div className="w-full mt-6">
          <label className="block text-gray-800 text-lg font-bold mb-2 text-left">
            Unit for Goods Produced
          </label>
          <select
            className="w-full px-3 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            value={selectedUnit}
            onChange={handleUnitChange}
            onBlur={saveToLocalStorage}
          >
            <option value="" disabled>Select Unit</option>          
            <option value="pcs">Kg</option>
            <option value="kg">Kg</option>
            <option value="tonnes">Tonnes</option>
            <option value="litres">Litres</option>
          </select>
        </div>
        
      </div>
    </>
  );
}
