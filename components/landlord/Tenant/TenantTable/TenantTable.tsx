"use client";

import { Card } from "@/components/ui/card";
import { TenantTableProps } from "@/types/landlord/Tenant/TenantTypes";
import { Download } from "lucide-react";
import { TenantRow } from "../TenantRow/TenantRow";

const TABLE_COLUMNS = [
  "Tenant",
  "Property",
  "Rent",
  "Start Date",
  "End Date",
  "Status",
  "Actions",
];

export default function TenantTable({
  tenants,
  search,
  onSearchChange,
}: TenantTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          All Tenants
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-56 rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </div>
          <button className="rounded-xl border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50">
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700/50">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {tenants.length > 0 ? (
              tenants.map((tenant, idx) => (
                <TenantRow key={tenant.id} tenant={tenant} idx={idx} />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tenants found for &quot;{search}&quot;
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
