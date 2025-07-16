import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ 
  question, 
  answer, 
  isOpen = false, 
  onToggle 
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const isExpanded = onToggle ? isOpen : internalIsOpen;

  return (
    <div className="bg-blue-900 rounded-lg overflow-hidden mb-4">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 text-left text-white font-medium flex items-center justify-between hover:bg-blue-800 transition-colors duration-200 focus:outline-none"
        aria-expanded={isExpanded}
      >
        <span className="text-sm leading-relaxed">{question}</span>
        <div className="ml-4 flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-blue-900 border-t border-blue-800">
          <p className="text-white text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;