"use client";
import { Checkbox } from "antd";
import { dummyDataForScopeThree } from "../Dummydata/DummydataScopeThree";
import { useScopeThree } from "../Context/ScopeThreeContext";
import ChooesactivitiesScopeThree from "./ChooesactivitiesScopeThree";
import ParametersForScopeTHree from "./ParametersForScopeThree";
export default function ScopeThreeFactor({ pageChange }) {
  const { checkedValuesScopeThree, setCheckedValuesScopeThree, setSelectedValuesScopeThree } = useScopeThree();

  console.log("values Scope 3", checkedValuesScopeThree);

  const handleCheckboxChange = (checkedValues) => {
    setCheckedValuesScopeThree(checkedValues);  // Update checked values state

  };

  return (
    <>
      {pageChange === 0 && (
        <div className="flex flex-col justify-center items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
          <div className="w-full md:w-[500px] max-w-2xl rounded-lg p-4 md:p-6 lg:mr-96">
            <h1 className="text-[20px] md:text-[22px] lg:text-[23px] font-sans">Scope Factors</h1>
            <Checkbox.Group
              onChange={handleCheckboxChange}
              value={checkedValuesScopeThree}
            >
              <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 mt-4 md:mt-6 lg:mt-8">
                {dummyDataForScopeThree.map((item) => (
                  <Checkbox key={item.value} value={item.value} className="text-[22px]">
                    {item.label}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </div>
        </div>
      )}

      {pageChange === 1 && (
        <ChooesactivitiesScopeThree></ChooesactivitiesScopeThree>
      )}
      {pageChange === 2 && (
        <ParametersForScopeTHree></ParametersForScopeTHree>
      )}

    </>
  );
}
