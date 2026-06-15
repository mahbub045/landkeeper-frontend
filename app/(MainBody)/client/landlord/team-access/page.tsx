'use client';

import { Key, Pencil, Trash2, UserPlus } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type MemberStatus = 'Active' | 'Pending';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  access: string;
  status: MemberStatus;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const members: TeamMember[] = [
  {
    id: 1,
    name: 'Robert Smith',
    role: 'Accountant',
    email: 'robert.smith@finance.co.uk',
    access: 'Financial records & reports',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Amanda White',
    role: 'Mortgage Adviser',
    email: 'amanda.white@mortgage.co.uk',
    access: 'Mortgage & property documents',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tom Green',
    role: 'Letting Agent',
    email: 'tom.green@lettings.co.uk',
    access: 'Tenant and tenancy data',
    status: 'Pending',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MemberStatus }) {
  if (status === 'Active') {
    return (
      <span className='flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'>
        <span className='size-1.5 rounded-full bg-emerald-500 inline-block' />
        Active
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800'>
      <span className='size-1.5 rounded-full bg-amber-400 inline-block' />
      Pending
    </span>
  );
}

function MemberRow({ member }: { member: TeamMember }) {
  return (
    <div className='flex items-center gap-4 px-4 py-4 border border-gray-100 dark:border-gray-700/50 rounded-2xl bg-white dark:bg-gray-800/50'>
      {/* Avatar */}
      <div className='size-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0'>
        <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>{getInitials(member.name)}</span>
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-bold text-gray-900 dark:text-white'>{member.name}</p>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
          {member.role} &bull; {member.email}
        </p>
        <p className='flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
          <Key className='size-3 shrink-0' />
          {member.access}
        </p>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2 shrink-0'>
        <StatusBadge status={member.status} />
        <button
          aria-label='Edit'
          className='size-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
        >
          <Pencil className='size-3.5' />
        </button>
        <button
          aria-label='Remove'
          className='size-9 flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors'
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamAccessPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Team Access</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Manage professional access to your portfolio</p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <UserPlus className='size-4' />
          Invite User
        </button>
      </div>

      {/* Card */}
      <div className='bg-white dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 space-y-3'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-4'>Active Team Members</h2>
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}