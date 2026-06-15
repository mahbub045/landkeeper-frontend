'use client';

import { Card } from '@/components/ui/card';
import { Download, Eye, Mail, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type TenantStatus = 'Active' | 'Renewal Due';

interface Tenant {
  id: number;
  name: string;
  email: string;
  property: string;
  rent: number;
  startDate: string;
  endDate: string;
  status: TenantStatus;
}

// ── Static Data ──────────────────────────────────────────────────────────────

const tenants: Tenant[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    property: '14 Oak Street',
    rent: 850,
    startDate: '01/06/2024',
    endDate: '01/06/2025',
    status: 'Renewal Due',
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'james.w@email.com',
    property: '42 Maple Avenue',
    rent: 400,
    startDate: '15/01/2024',
    endDate: '15/01/2025',
    status: 'Renewal Due',
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma.d@email.com',
    property: '42 Maple Avenue',
    rent: 380,
    startDate: '01/03/2024',
    endDate: '01/03/2025',
    status: 'Renewal Due',
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    property: '42 Maple Avenue',
    rent: 420,
    startDate: '01/09/2024',
    endDate: '01/09/2025',
    status: 'Renewal Due',
  },
  {
    id: 5,
    name: 'Lisa Taylor',
    email: 'lisa.t@email.com',
    property: '8 Pine Road',
    rent: 750,
    startDate: '01/04/2024',
    endDate: '01/04/2025',
    status: 'Renewal Due',
  },
  {
    id: 6,
    name: 'David Clark',
    email: 'david.c@email.com',
    property: '23 Elm Drive',
    rent: 1500,
    startDate: '01/12/2023',
    endDate: '01/12/2028',
    status: 'Active',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Consistent avatar colour per tenant based on initials
const avatarColors = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
];

function avatarColor(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TenantStatus }) {
  if (status === 'Active') {
    return (
      <span className='inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full'>
        <span className='size-1.5 rounded-full bg-emerald-500 inline-block' />
        Active
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full'>
      <span className='size-1.5 rounded-full bg-amber-500 inline-block' />
      Renewal Due
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TenantsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return tenants;
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.property.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Tenants
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Manage tenant information and tenancies
          </p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <Plus className='size-4' />
          Add Tenant
        </button>
      </div>

      {/* Table card */}
      <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden'>
        {/* Card header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700/50'>
          <h2 className='text-base font-semibold text-gray-900 dark:text-white'>All Tenants</h2>
          <div className='flex items-center gap-2'>
            {/* Search */}
            <div className='relative flex items-center'>
              <input
                type='text'
                placeholder='Search tenants...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 transition-colors'
              />
            </div>
            {/* Export */}
            <button className='p-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
              <Download className='size-4' />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-100 dark:border-gray-700/50'>
                {['Tenant', 'Property', 'Rent', 'Start Date', 'End Date', 'Status', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className='px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700/50'>
              {filtered.length > 0 ? (
                filtered.map((tenant, idx) => (
                  <tr
                    key={tenant.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'
                  >
                    {/* Tenant */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(idx)}`}
                        >
                          {getInitials(tenant.name)}
                        </div>
                        <div>
                          <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                            {tenant.name}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{tenant.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                      {tenant.property}
                    </td>

                    {/* Rent */}
                    <td className='px-6 py-4 text-sm font-bold text-gray-900 dark:text-white'>
                      £{tenant.rent.toLocaleString('en-GB')}
                    </td>

                    {/* Start Date */}
                    <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                      {tenant.startDate}
                    </td>

                    {/* End Date */}
                    <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                      {tenant.endDate}
                    </td>

                    {/* Status */}
                    <td className='px-6 py-4'>
                      <StatusBadge status={tenant.status} />
                    </td>

                    {/* Actions */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <button className='p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                          <Eye className='size-4' />
                        </button>
                        <button className='p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                          <Mail className='size-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='px-6 py-16 text-center'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      No tenants found for &quot;{search}&quot;
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}