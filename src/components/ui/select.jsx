
  // src/components/ui/select.jsx
  import React, { useState } from 'react';
  
  export function Select({ children, value, onValueChange, ...props }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleSelect = (selectedValue) => {
      onValueChange(selectedValue);
      setIsOpen(false);
    };
  
    return (
      <div className="relative" {...props}>
        <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
          <SelectValue>{value || 'Select...'}</SelectValue>
        </SelectTrigger>
        {isOpen && (
          <SelectContent>
            {React.Children.map(children, child => 
              React.cloneElement(child, {
                onClick: () => handleSelect(child.props.value)
              })
            )}
          </SelectContent>
        )}
      </div>
    );
  }
  
  export function SelectTrigger({ children, ...props }) {
    return (
      <div 
        className="border rounded px-3 py-2 cursor-pointer flex justify-between items-center" 
        {...props}
      >
        {children}
        <span>▼</span>
      </div>
    );
  }
  
  export function SelectValue({ children }) {
    return <span>{children}</span>;
  }
  
  export function SelectContent({ children }) {
    return (
      <div className="absolute z-10 border rounded mt-1 bg-white shadow-lg w-full">
        {children}
      </div>
    );
  }
  
  export function SelectItem({ value, children, onClick }) {
    return (
      <div 
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
  