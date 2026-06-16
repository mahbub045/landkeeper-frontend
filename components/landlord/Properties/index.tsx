"use client";

import {
  filterProperties,
  filterTabs,
  properties,
} from "@/data/landlord/properties/PropertiesData";
import { FilterTab } from "@/types/landlord/Properties/PropertyTypes";
import { Plus } from "lucide-react";
import { useState } from "react";
import PropertyFilter from "./Propertyfilter/Propertyfilter";
import PropertyGrid from "./Propertygrid/Propertygrid";

export default function PropertiesContainer() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const filtered = filterProperties(properties, activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Properties
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your property portfolio
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <Plus className="size-4" />
          Add Property
        </button>
      </div>

      <PropertyFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <PropertyGrid properties={filtered} activeFilter={activeFilter} />
    </div>
  );
}
