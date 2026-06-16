"use client";

import { Plus } from "lucide-react";
import MonthlyChart from "./MonthlyChart/MonthlyChart";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
import StatCards from "./StatCards/StatCards";

export default function FinanceContainer() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Financial Tracking
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Income, expenses and tax preparation
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <Plus className="size-4" />
          Add Transaction
        </button>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MonthlyChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
