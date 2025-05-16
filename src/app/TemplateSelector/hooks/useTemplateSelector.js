import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useTemplateSelector = () => {
  const [userId, setUserId] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplatesToDelete, setSelectedTemplatesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("email");
      const SupervisiorName = localStorage.getItem("SupervisiorName");
      if (SupervisiorName !== "N/A") {
        setUserId(SupervisiorName);
      } else {
        setUserId(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTemplate = localStorage.getItem("selectedTemplate");
      if (storedTemplate) {
        setSelectedTemplate(storedTemplate);
      }
    }
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    localStorage.setItem("selectedTemplate", template);
  };

  const handleNext = async () => {
    if (!userId || !selectedTemplate) {
      alert("Please select a template before proceeding!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://ghg-conversion-factors-backend.vercel.app/getTempnameToEditing?username=${userId}&templatecontent=${selectedTemplate}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      if (data.entries && data.entries.length > 0) {
        localStorage.setItem("UpdateingTemp", JSON.stringify(data.entries.map(entry => entry.templatesave)));
        localStorage.setItem("templatecontent", JSON.stringify(data.entries.map(entry => entry.templatecontent)));
        localStorage.setItem("templateSaves", JSON.stringify(data.entries.map(entry => entry.templatesave)));
        localStorage.setItem("templatID", JSON.stringify(data.entries.map(entry => entry.id)));
        localStorage.setItem("templateSave_scope2", JSON.stringify(data.entries.map(entry => entry.templateSave_scope2)));
        router.push("/DataEntery");
      } else {
        alert("No entries found for this template");
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      alert("Failed to load template data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // const username = localStorage.getItem("username")
        const response = await fetch(
          `https://ghg-conversion-factors-backend.vercel.app/getTemplates?username=${userId}`,
          { method: "GET" }
        );

        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
        alert("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userId]);

  const handleCheckboxChange = (template) => {
    setSelectedTemplatesToDelete((prev) =>
      prev.includes(template)
        ? prev.filter((t) => t !== template)
        : [...prev, template]
    );
  };

  const handleDeleteTemplates = async () => {
    if (selectedTemplatesToDelete.length === 0) {
      alert("Please select templates to delete");
      return;
    }

    if (!confirm("Are you sure you want to delete the selected templates? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/deleteTemplates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, templates: selectedTemplatesToDelete }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Templates deleted successfully!");
        setTemplates((prev) => prev.filter((t) => !selectedTemplatesToDelete.includes(t)));
        setSelectedTemplatesToDelete([]);
        setShowCheckboxes(false);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting templates:", error);
      alert("An error occurred while deleting the templates.");
    }
  };

  return {
    userId,
    templates,
    selectedTemplate,
    selectedTemplatesToDelete,
    loading,
    showCheckboxes,
    handleTemplateSelect,
    handleNext,
    handleCheckboxChange,
    handleDeleteTemplates,
    setShowCheckboxes,
  };
};

export default useTemplateSelector;
