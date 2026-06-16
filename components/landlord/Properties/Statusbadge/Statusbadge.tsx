"use client";

import { PropertyStatus } from "@/types/landlord/Properties/PropertyTypes";

interface StatusBadgeProps {
  status: PropertyStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Occupied") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 backdrop-blur-sm">
        <span className="inline-block size-1.5 rounded-full bg-emerald-700/90" />
        Occupied
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 backdrop-blur-sm dark:bg-gray-800/90 dark:text-gray-300">
      <span className="inline-block size-1.5 rounded-full bg-gray-400/90" />
      Vacant
    </span>
  );
}
