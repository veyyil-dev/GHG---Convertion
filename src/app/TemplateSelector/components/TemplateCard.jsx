"use client";

import React from 'react';
import { motion } from 'framer-motion';

const TemplateCard = ({
  template,
  selectedTemplate,
  showCheckboxes,
  selectedTemplatesToDelete = [],
  handleTemplateSelect,
  handleCheckboxChange,
}) => {
  const isSelected = selectedTemplate === template;
  const isChecked = selectedTemplatesToDelete.includes(template);

  return (
    <motion.div
      key={template}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative group cursor-pointer transition-all duration-300 ${
        isSelected ? 'transform scale-[1.01] sm:scale-[1.02]' : ''
      }`}
    >
      <div
        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
          isSelected
            ? 'border-[#39CD98] bg-[#39CD98]/10 shadow-md'
            : 'border-gray-200 bg-white hover:border-[#39CD98] hover:shadow-sm'
        }`}
        onClick={() => !showCheckboxes && handleTemplateSelect(template)} // don't select if checkboxes are shown
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isSelected && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#39CD98]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-base sm:text-lg font-medium text-gray-800 break-words">
              {template}
            </span>
          </div>

          {showCheckboxes && (
            <label className="flex items-center space-x-2 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  e.stopPropagation(); // prevent parent click
                  handleCheckboxChange(template);
                }}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#39CD98] border-gray-300 rounded focus:ring-[#39CD98]"
              />
            </label>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
