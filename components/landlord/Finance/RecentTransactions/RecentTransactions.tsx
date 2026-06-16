"use client";

import {
  categoryStyles,
  transactions,
} from "@/data/landlord/finance/FinanceData";
import { TxCategory } from "@/types/landlord/Finance/FinanceTypes";

export function formatGBP(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("en-GB");
  return amount < 0 ? `-£${abs}` : `+£${abs}`;
}

function CategoryBadge({ category }: { category: TxCategory }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${categoryStyles[category]}`}
    >
      {category}
    </span>
  );
}

const TABLE_HEADERS = ["DATE", "DESCRIPTION", "CATEGORY", "AMOUNT"];

export default function RecentTransactions() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
      </div>

      <div className="grid grid-cols-[90px_1fr_130px_80px] gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-700/50">
        {TABLE_HEADERS.map((h) => (
          <span
            key={h}
            className="text-[10px] font-bold tracking-widest text-gray-400 uppercase last:text-right dark:text-gray-500"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="max-h-[340px] divide-y divide-gray-50 overflow-y-auto dark:divide-gray-700/30">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="grid grid-cols-[90px_1fr_130px_80px] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-700/20"
          >
            <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
              {tx.date}
            </span>
            <span className="text-xs leading-snug text-gray-700 dark:text-gray-300">
              {tx.description}
            </span>
            <CategoryBadge category={tx.category} />
            <span
              className={`text-right text-xs font-bold tabular-nums ${
                tx.amount < 0
                  ? "text-red-500 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatGBP(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
