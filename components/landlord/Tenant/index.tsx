"use client";

import { tenants } from "@/data/landlord/tenant/TenantData";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import TenantTable from "./TenantTable/TenantTable";

export default function TenantsContainer() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return tenants;
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.property.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tenants
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage tenant information and tenancies
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <Plus className="size-4" />
          Add Tenant
        </button>
      </div>

      <TenantTable
        tenants={filtered}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  );
}
