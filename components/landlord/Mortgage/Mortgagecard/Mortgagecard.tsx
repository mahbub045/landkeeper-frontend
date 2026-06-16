"use client";

import {
  formatCurrency,
  formatTerm,
} from "@/data/landlord/mortgage/MortgageData";
import { MortgageCardProps } from "@/types/landlord/Mortgage/MortgageTypes";
import { Calculator, FileText, TriangleAlert } from "lucide-react";

export default function MortgageCard({ mortgage }: MortgageCardProps) {
  return (
    <div className="space-y-5 rounded-2xl bg-[#0f172a] p-6 text-white">
      {/* Top row: property + lender name + rate */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{mortgage.property}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold">
              {mortgage.lender} – {mortgage.type}
            </h2>
            {mortgage.renewalDue && (
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
                <TriangleAlert className="size-3.5" />
                Renewal Due
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-400">Rate</p>
          <p className="text-2xl font-bold">{mortgage.interestRate}%</p>
        </div>
      </div>

      {/* Outstanding balance */}
      <div>
        <p className="text-3xl font-bold">
          {formatCurrency(mortgage.outstandingBalance)}
        </p>
        <p className="mt-1 text-sm text-gray-400">Outstanding Balance</p>
      </div>

      <div className="border-t border-white/10" />

      {/* Three stats */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-400">Original Loan</p>
          <p className="mt-1 text-base font-semibold">
            {formatCurrency(mortgage.originalLoan)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Monthly Payment</p>
          <p className="mt-1 text-base font-semibold">
            {formatCurrency(mortgage.monthlyPayment)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Term Remaining</p>
          <p className="mt-1 text-base font-semibold">
            {formatTerm(mortgage.termRemainingMonths)}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10" />

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
          <FileText className="size-4" />
          View Documents
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
          <Calculator className="size-4" />
          Remortgage Calculator
        </button>
      </div>
    </div>
  );
}
