'use client';

import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface UsageStat {
  label: string;
  value: string;
  percent: number;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const usageStats: UsageStat[] = [
  { label: 'Properties',   value: '5 / Unlimited', percent: 12  },
  { label: 'Storage',      value: '1.2 GB / 10 GB', percent: 12 },
  { label: 'Team Members', value: '3 / 10',          percent: 30 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      role='switch'
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 mt-0.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className='space-y-1.5'>
      <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
      />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // Profile state
  const [fullName, setFullName]       = useState('John Davidson');
  const [email, setEmail]             = useState('john.davidson@email.com');
  const [phone, setPhone]             = useState('+44 7700 900123');
  const [company, setCompany]         = useState('Davidson Property Holdings Ltd');

  // Notification state
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: 'email',    title: 'Email Alerts',          description: 'Receive compliance and renewal reminders',      enabled: true  },
    { id: 'sms',      title: 'SMS Notifications',     description: 'Get urgent alerts via text message',            enabled: false },
    { id: 'weekly',   title: 'Weekly Summary',        description: 'Portfolio performance email every Monday',      enabled: true  },
    { id: 'docs',     title: 'Document Upload Alerts',description: 'Notify when team members upload documents',     enabled: true  },
  ]);

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Settings</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>Manage your account and preferences</p>
      </div>

      {/* Top two-column layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {/* Profile Settings */}
        <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm space-y-5'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Profile Settings</h2>
          <div className='space-y-4'>
            <FormField label='Full Name'    value={fullName} onChange={setFullName} />
            <FormField label='Email'        value={email}    onChange={setEmail}    type='email' />
            <FormField label='Phone'        value={phone}    onChange={setPhone}    type='tel' />
            <FormField label='Company Name' value={company}  onChange={setCompany} />
          </div>
          <button className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors'>
            Save Changes
          </button>
        </div>

        {/* Notifications */}
        <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-5'>Notifications</h2>
          <div className='divide-y divide-gray-50 dark:divide-gray-700/40'>
            {notifications.map((n) => (
              <div key={n.id} className='flex items-center justify-between py-4 first:pt-0 last:pb-0'>
                <div>
                  <p className='text-sm font-bold text-gray-900 dark:text-white'>{n.title}</p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>{n.description}</p>
                </div>
                <Toggle enabled={n.enabled} onToggle={() => toggleNotification(n.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm space-y-6'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Subscription</h2>

        {/* Plan banner */}
        <div className='flex items-center justify-between bg-gray-900 dark:bg-gray-950 rounded-2xl px-6 py-5'>
          <div>
            <p className='text-lg font-bold text-white'>Premium Plan</p>
            <p className='text-sm text-gray-300 mt-0.5'>£24.99/month · Unlimited properties</p>
            <p className='text-xs text-gray-400 mt-1'>Next billing: 15 June 2026</p>
          </div>
          <button className='bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors'>
            Manage Plan
          </button>
        </div>

        {/* Usage */}
        <div className='space-y-4'>
          <p className='text-sm font-semibold text-gray-900 dark:text-white'>Usage</p>
          {usageStats.map((stat) => (
            <div key={stat.label} className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>{stat.label}</span>
                <span className='text-sm font-semibold text-gray-900 dark:text-white'>{stat.value}</span>
              </div>
              <div className='h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden'>
                <div
                  className='h-full rounded-full bg-blue-600'
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}