import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ subject, collection, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = value || "Select";

  const handleSelect = (item) => {
    setIsOpen(false);
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <div className="flex flex-col w-48 text-sm relative">
      <label className="mb-1.5 text-ink-subtle font-medium text-xs">{subject}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 pr-2 py-2.5 border border-hairline rounded-lg bg-surface-1 text-ink hover:bg-surface-2 hover:border-hairline-strong focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      >
        <span>{selected}</span>
        <ChevronDown className={`w-4 h-4 inline float-right text-ink-subtle transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-surface-2 border border-hairline rounded-lg shadow-xl mt-1 py-1 z-10">
          {collection.map((item) => (
            <li
              key={item}
              className="px-4 py-2 hover:bg-primary/10 hover:text-ink cursor-pointer transition text-ink-muted"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
