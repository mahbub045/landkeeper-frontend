"use client";

import { Plus } from "lucide-react";
import MortgageList from "./Mortgagelist/Mortgagelist";
import SummaryCards from "./Summarycards/Summarycards";

export default function MortgageContainer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Mortgages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage your property financing
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <Plus className="size-4" />
          Add Mortgage
        </button>
      </div>

      <SummaryCards />
      <MortgageList />
    </div>
  );
}
