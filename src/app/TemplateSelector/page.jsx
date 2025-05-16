"use client"
import React ,{useEffect} from 'react';
import { Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import useTemplateSelector from './hooks/useTemplateSelector';
import TemplateCard from './components/TemplateCard';
import { useRouter } from 'next/navigation';
import { useScopeOne } from '../(Scopes)/ScopeOne/Context/ScopeOneContext';
// import { useRouter } from 'next/navigation';
const TemplateSelector = () => {
  const {
    templates,
    selectedTemplate,
    loading,
    showCheckboxes,
    handleTemplateSelect,
    selectedTemplatesToDelete,
    handleNext,
    handleCheckboxChange,
    handleDeleteTemplates,
    setShowCheckboxes
  } = useTemplateSelector();

  const router = useRouter();

  console.log(selectedTemplatesToDelete)

  const {getToken} = useScopeOne();


    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.push('/login');
      }
    }, [router]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
       
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800">
          Select Template
        </h1>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#39CD98] border-t-transparent"></div>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">Loading templates...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-500">No templates available</p>
              </div>
            ) : (
              <AnimatePresence>
               {templates.map((template) => (
  <TemplateCard
    key={template._id || template.id} // Use a unique identifier
    template={template}
    selectedTemplate={selectedTemplate}
    showCheckboxes={showCheckboxes}
    selectedTemplatesToDelete={selectedTemplatesToDelete}
    handleTemplateSelect={handleTemplateSelect}
    handleCheckboxChange={handleCheckboxChange}
  />
))}

              </AnimatePresence>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4 mt-6 sm:mt-8">
            


            <Button
              onClick={handleNext}
              disabled={!selectedTemplate || loading}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                !selectedTemplate || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#39CD98] text-white hover:bg-[#39CD98]/90'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;