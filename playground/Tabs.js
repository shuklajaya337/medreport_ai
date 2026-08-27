"use client";

import { useState, useRef } from "react";

export function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);

  const handleKeyDown = (e) => {
    let newIndex = activeIndex;

    if (e.key === "ArrowRight") {
      newIndex = (activeIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Example Tabs" className="flex gap-2 border-b">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            className={`px-4 py-2 font-medium ${
              activeIndex === index
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-neutral-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          className="p-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}