'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Flame, Zap, Droplets, Download, Pencil } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type CertStatus = 'Valid' | 'Expired' | 'Expiring Soon';

interface Certificate {
  id: number;
  property: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: CertStatus;
}

interface Expiration {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

// ── Static Data ──────────────────────────────────────────────────────────────

const certificates: Certificate[] = [
  {
    id: 1,
    property: '14 Oak Street',
    type: 'Gas Safety Certificate',
    issueDate: '15/05/2024',
    expiryDate: '15/05/2025',
    status: 'Expired',
  },
  {
    id: 2,
    property: '14 Oak Street',
    type: 'EPC Certificate',
    issueDate: '10/01/2023',
    expiryDate: '10/01/2033',
    status: 'Valid',
  },
  {
    id: 3,
    property: '42 Maple Avenue',
    type: 'HMO Licence',
    issueDate: '01/02/2024',
    expiryDate: '01/02/2027',
    status: 'Valid',
  },
  {
    id: 4,
    property: '42 Maple Avenue',
    type: 'Gas Safety Certificate',
    issueDate: '20/06/2024',
    expiryDate: '20/06/2025',
    status: 'Expired',
  },
  {
    id: 5,
    property: '8 Pine Road',
    type: 'EPC Certificate',
    issueDate: '15/03/2024',
    expiryDate: '15/03/2034',
    status: 'Valid',
  },
  {
    id: 6,
    property: '8 Pine Road',
    type: 'Electrical Safety Certificate',
    issueDate: '20/01/2024',
    expiryDate: '20/01/2029',
    status: 'Valid',
  },
  {
    id: 7,
    property: '23 Elm Drive',
    type: 'Fire Risk Assessment',
    issueDate: '10/04/2024',
    expiryDate: '10/04/2025',
    status: 'Expired',
  },
  {
    id: 8,
    property: '7 Cedar Lane',
    type: 'EPC Certificate',
    issueDate: '20/05/2022',
    expiryDate: '20/05/2032',
    status: 'Valid',
  },
];

const upcomingExpirations: Expiration[] = [
  {
    id: 1,
    title: 'Gas Safety Certificate',
    subtitle: '14 Oak Street - Expired 3 days ago',
    icon: Flame,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
  },
  {
    id: 2,
    title: 'EPC Certificate',
    subtitle: '42 Maple Avenue - Expires in 14 days',
    icon: Zap,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
  },
  {
    id: 3,
    title: 'Fire Risk Assessment',
    subtitle: '8 Pine Road - Expires in 45 days',
    icon: Droplets,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
  },
];

// Progress bars for compliance score breakdown
const complianceBreakdown = [
  { label: 'Gas Safety', current: 4, total: 5, color: 'bg-amber-400' },
  { label: 'EPC', current: 5, total: 5, color: 'bg-emerald-500' },
  { label: 'Electrical', current: 5, total: 5, color: 'bg-emerald-500' },
];

// ── Donut chart via SVG ───────────────────────────────────────────────────────

function DonutChart({ percent }: { percent: number }) {
  const r = 70;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const filled = (percent / 100) * circumference;

  return (
    <svg viewBox='0 0 200 200' className='w-44 h-44'>
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke='currentColor'
        strokeWidth='14'
        className='text-gray-200 dark:text-gray-700'
      />
      {/* Fill */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke='#10b981'
        strokeWidth='14'
        strokeLinecap='round'
        strokeDasharray={`${filled} ${circumference}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Label */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor='middle'
        dominantBaseline='middle'
        className='fill-gray-900 dark:fill-white'
        style={{ fontSize: 28, fontWeight: 700 }}
      >
        {percent}%
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor='middle'
        dominantBaseline='middle'
        className='fill-gray-500 dark:fill-gray-400'
        style={{ fontSize: 13 }}
      >
        Compliant
      </text>
    </svg>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CertStatus }) {
  if (status === 'Valid') {
    return (
      <span className='inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full'>
        <span className='size-1.5 rounded-full bg-emerald-500 inline-block' />
        Valid
      </span>
    );
  }
  if (status === 'Expired') {
    return (
      <span className='inline-flex items-center gap-1.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-semibold px-3 py-1 rounded-full'>
        <span className='size-1.5 rounded-full bg-red-500 inline-block' />
        Expired
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full'>
      <span className='size-1.5 rounded-full bg-amber-500 inline-block' />
      Expiring Soon
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const complianceScore = 87;
  const validCount = certificates.filter((c) => c.status === 'Valid').length;
  const totalCount = certificates.length;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Compliance &amp; Certifications
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Track certificates and regulatory requirements
          </p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <Plus className='size-4' />
          Add Certificate
        </button>
      </div>

      {/* Top two cards */}
      <div className='grid gap-4 grid-cols-1 lg:grid-cols-2'>

        {/* Compliance Score */}
        <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold text-gray-900 dark:text-white'>
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center gap-4 pb-6'>
            {/* Donut */}
            <DonutChart percent={complianceScore} />

            {/* Subtitle */}
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {validCount} of {totalCount} properties have valid certificates
            </p>

            {/* Progress bars */}
            <div className='w-full space-y-4 mt-2'>
              {complianceBreakdown.map((item) => (
                <div key={item.label}>
                  <div className='flex items-center justify-between mb-1.5'>
                    <span className='text-sm text-gray-700 dark:text-gray-300'>{item.label}</span>
                    <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {item.current}/{item.total}
                    </span>
                  </div>
                  <div className='h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all`}
                      style={{ width: `${(item.current / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Expirations */}
        <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold text-gray-900 dark:text-white'>
              Upcoming Expirations
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4 space-y-0'>
            {upcomingExpirations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 py-4 ${
                    idx < upcomingExpirations.length - 1
                      ? 'border-b border-gray-100 dark:border-gray-700/50'
                      : ''
                  }`}
                >
                  <div className={`p-2.5 rounded-full ${item.iconBg} shrink-0`}>
                    <Icon className={`size-4 ${item.iconColor}`} />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                      {item.title}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Certificate Registry table */}
      <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden'>
        <CardHeader className='pb-3 border-b border-gray-100 dark:border-gray-700/50'>
          <CardTitle className='text-base font-semibold text-gray-900 dark:text-white'>
            Certificate Registry
          </CardTitle>
        </CardHeader>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-100 dark:border-gray-700/50'>
                {['Property', 'Type', 'Issue Date', 'Expiry Date', 'Status', 'Actions'].map(
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
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'
                >
                  {/* Property */}
                  <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                    {cert.property}
                  </td>

                  {/* Type */}
                  <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                    <span className='flex items-center gap-2'>
                      <span className='text-blue-500'>✳</span>
                      {cert.type}
                    </span>
                  </td>

                  {/* Issue Date */}
                  <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                    {cert.issueDate}
                  </td>

                  {/* Expiry Date */}
                  <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                    {cert.expiryDate}
                  </td>

                  {/* Status */}
                  <td className='px-6 py-4'>
                    <StatusBadge status={cert.status} />
                  </td>

                  {/* Actions */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <button className='p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                        <Download className='size-4' />
                      </button>
                      <button className='p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                        <Pencil className='size-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}