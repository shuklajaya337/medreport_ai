"use client";

import { useState } from "react";

export function Disclosure({ summary, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls="disclosure-content"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-medium"
      >
        <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
          ▶
        </span>
        {summary}
      </button>

      {isOpen && (
        <div id="disclosure-content" className="mt-2 pl-6">
          {children}
        </div>
      )}
    </div>
  );
}