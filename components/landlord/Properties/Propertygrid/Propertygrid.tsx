"use client";

import { FilterTab, Property } from "@/types/landlord/Properties/PropertyTypes";
import { Home } from "lucide-react";
import PropertyCard from "../Propertycard/Propertycard";

interface PropertyGridProps {
  properties: Property[];
  activeFilter: FilterTab;
}

export default function PropertyGrid({
  properties,
  activeFilter,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Home className="mb-3 size-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No properties found for &quot;{activeFilter}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
