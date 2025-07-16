import React, { useState } from 'react';
import FAQItem from './FAQItem';

interface FAQData {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  faqs: FAQData[];
  allowMultipleOpen?: boolean;
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({
  title = "FAQs",
  faqs,
  allowMultipleOpen = false,
  className = ""
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultipleOpen) {
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        newOpenItems.add(id);
      }
    } else {
      // Only allow one item to be open at a time
      if (newOpenItems.has(id)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(id);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-8">
          {title}
        </h1>
      </div>
      
      <div className="space-y-0">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openItems.has(faq.id)}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;