import React, { useEffect } from 'react'
import { Layout, Check } from "lucide-react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {

  // Force template to "classic"
  useEffect(() => {
    if (selectedTemplate !== "classic") {
      onChange("classic");
    }
  }, [selectedTemplate, onChange]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-300 px-3 py-2 rounded-lg">
        <Layout size={14} />
        <span>Classic Template</span>

        <div className="ml-2 size-5 bg-blue-400 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
