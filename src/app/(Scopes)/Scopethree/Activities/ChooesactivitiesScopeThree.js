"use client";

import { useScopeThree } from "../Context/ScopeThreeContext";
import { DummydataForScopeThreeActives } from "../Dummydata/DummydataScopeThree";
import { Disclosure } from '@headlessui/react'; // Import Disclosure from headlessui
import { FaChevronDown } from 'react-icons/fa'; // Assuming you're using react-icons for FaChevronDown
import { FaFaChevronDown } from 'react-icons/fa';
import { Checkbox } from "antd";

export default function ChooesactivitiesScopeThree() {
  const { checkedValuesScopeThree, selectedValuesScopeThree, setSelectedValuesScopeThree } = useScopeThree();

  console.log("From activity page", selectedValuesScopeThree);

  console.log("Form1 activity page",checkedValuesScopeThree)

  const handleCheckboxChange = (category, item) => {
    setSelectedValuesScopeThree((prev) => {
      const updatedCategoryValues = prev[category] ? [...prev[category]] : [];
      if (updatedCategoryValues.includes(item)) {
        updatedCategoryValues.splice(updatedCategoryValues.indexOf(item), 1);
      } else {
        updatedCategoryValues.push(item);
      }
      return { ...prev, [category]: updatedCategoryValues };
    });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#effbf7] w-full md:w-[768px] lg:w-[1152px] md:mx-auto mt-10 md:mt-16 lg:mt-10 p-4 md:p-6 rounded-xl shadow-xl flex-grow min-h-[515px]">
      <div className="w-full min-h-[250px] flex-grow text-[22px]">
        {Object.keys(DummydataForScopeThreeActives).map((key) => (
          checkedValuesScopeThree.includes(key) && (
            <Disclosure key={key}>
              {({ open }) => (
                <div className="bg-[#BFF1DF] w-full mt-4 rounded-lg shadow-sm">
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-lg font-medium text-gray-700">
                    <span>{key}</span>
                    <FaChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="p-4 w-full bg-[#effbf7] rounded-b-lg">
                    <div className="flex flex-wrap gap-4">
                      {DummydataForScopeThreeActives[key]?.map((item, idx) => (
                        <Checkbox
                          key={idx}
                          checked={selectedValuesScopeThree[key]?.includes(item) || false}
                          onChange={() => handleCheckboxChange(key, item)}
                        >
                          {item}
                        </Checkbox>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          )
        ))}
      </div>
    </div>
  );
}
