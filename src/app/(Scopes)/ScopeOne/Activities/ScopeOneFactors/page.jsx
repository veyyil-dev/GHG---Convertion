"use client";

import { Checkbox } from "antd";
import Chooseactivities from "../Chooseactivities";
import { useScopeOne } from "../../Context/ScopeOneContext";
import Parameters from "../Parameters";
import { useEffect, useState, useRef } from "react";
import CreateTempName from "../CreareTempName";

export default function ScopeOneFactors() {
  const {
    checkedValuesScopeOne,
    setCheckedValuesScopeOne,
    activities,
    setActivities,
    allEntries,
    userId,
    setUserId,
    editTemplate,
    setEditTemplate,
    fetchedCheckedValues,
    setFetchedCheckedValues,
    pageChange,
  } = useScopeOne();

  console.log("fetchedCheckedValues from scopeOnefactor", fetchedCheckedValues);

  const Id = allEntries.map((entry) => entry.id).join(",");
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // Fetch Scope Factors
  const fetchFactors = async () => {
    // https://ghg-conversion-factors-backend.vercel.app/api/scope1/scope_factors
    try {
      const response = await fetch(
        "https://ghg-conversion-factors-backend.vercel.app/scope_factors"
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      console.log("Fetched activities before filtering:", data); // 🔍 Debug log
  
      // 🔴 Remove "UK Electricity" from the activities list
      const filteredActivities = data.filter(item => item !== "UK Electricity");
  
      console.log("Filtered Scope 1 activities:", filteredActivities); // Debug log
  
      setActivities(
        filteredActivities.map((item) => ({ name: item, value: item }))
      );
    } catch (error) {
      console.error("Error fetching scope factors:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };
  


  // ✅ Handle Checkbox Changes (Editable in Edit Mode)
  const handleCheckboxChange = (updatedValues) => {
    if (editTemplate === "Edit") {
      setFetchedCheckedValues(updatedValues); // ✅ Allow editing in Edit Mode
    }
    setCheckedValuesScopeOne(updatedValues);
    console.log("Updated values:", updatedValues);
  };

  // ✅ Initial Fetch
  useEffect(() => {
    fetchFactors();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("username");
      if (storedUserId) setUserId(storedUserId);
    }
  }, []);

  return (
    <>
      {pageChange === -1 && <CreateTempName />}

      {pageChange === 0 && (
        <div className="flex flex-col justify-center items-center bg-[#EFFBF7] border-[black] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
          <div className="w-full md:w-[500px] max-w-2xl rounded-lg p-4 md:p-6">
            <h1 className="text-[20px] md:text-[22px] lg:text-[23px] font-black mr-52">
              Scope Factors
            </h1>

            {/* Show loading state */}
            {loading ? (
              <p>Loading...</p>
            ) : activities.length > 0 ? (
              <Checkbox.Group
                onChange={handleCheckboxChange}
                value={checkedValuesScopeOne} // ✅ Keeps selections persistent
              >
                <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 mt-4 md:mt-6 lg:mt-8 font-sherif">
                  {activities.map((item) => (
                    <Checkbox key={item.value} value={item.value} className="text-[22px]">
                      {item.name}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            ) : (
              <p>No activities found</p>
            )}
          </div>
        </div>
      )}

      {pageChange === 10 && <Chooseactivities />}
      {pageChange === 1 && <Parameters />}
    </>
  );
}
