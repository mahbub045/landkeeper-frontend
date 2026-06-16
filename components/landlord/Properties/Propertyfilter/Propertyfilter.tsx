"use client";

import { FilterTab } from "@/types/landlord/Properties/PropertyTypes";

interface PropertyFilterProps {
  filterTabs: FilterTab[];
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}

export default function PropertyFilter({
  filterTabs,
  activeFilter,
  onFilterChange,
}: PropertyFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onFilterChange(tab)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            activeFilter === tab
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
