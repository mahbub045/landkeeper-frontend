'use client';

import { Calculator, Percent, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// ── Types ─────────────────────────────────────────────────────────────────────

type TxCategory =
  | 'Insurance'
  | 'Repairs'
  | 'Mortgage Payment'
  | 'Rental Income'
  | 'Utilities'
  | 'Management Fee';

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: TxCategory;
  amount: number; // positive = income, negative = expense
}

// ── Static Data ───────────────────────────────────────────────────────────────

const monthlyData = [
  { month: 'Jan', income: 2600 },
  { month: 'Feb', income: 2620 },
  { month: 'Mar', income: 2550 },
  { month: 'Apr', income: 2540 },
  { month: 'May', income: 2680 },
  { month: 'Jun', income: 2700 },
];

const transactions: Transaction[] = [
  { id: 1,  date: '10/05/2026', description: 'Building insurance monthly',   category: 'Insurance',        amount: -45   },
  { id: 2,  date: '15/05/2026', description: 'Plumbing repair',              category: 'Repairs',          amount: -350  },
  { id: 3,  date: '01/05/2026', description: 'Barclays mortgage payment',    category: 'Mortgage Payment', amount: -1650 },
  { id: 4,  date: '01/05/2026', description: 'Commercial rent - David Clark',category: 'Rental Income',   amount: 1500  },
  { id: 5,  date: '01/05/2026', description: 'Santander mortgage payment',   category: 'Mortgage Payment', amount: -720  },
  { id: 6,  date: '01/05/2026', description: 'Monthly rent - Lisa Taylor',   category: 'Rental Income',   amount: 750   },
  { id: 7,  date: '01/05/2026', description: 'Nationwide mortgage payment',  category: 'Mortgage Payment', amount: -980  },
  { id: 8,  date: '01/05/2026', description: 'Monthly rent - HMO tenants',   category: 'Rental Income',   amount: 1200  },
  { id: 9,  date: '01/05/2026', description: 'Halifax mortgage payment',     category: 'Mortgage Payment', amount: -1250 },
  { id: 10, date: '01/05/2026', description: 'Monthly rent - Sarah Johnson', category: 'Rental Income',   amount: 850   },
];

// ── Category badge styles ─────────────────────────────────────────────────────

const categoryStyles: Record<TxCategory, string> = {
  'Insurance':        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Repairs':          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Mortgage Payment': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Rental Income':    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Utilities':        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'Management Fee':   'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatGBP(amount: number): string {
  const abs = Math.abs(amount).toLocaleString('en-GB');
  return amount < 0 ? `-£${abs}` : `+£${abs}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}) {
  return (
    <div className='flex-1 min-w-0 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm'>
      <div className={`size-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <p className='text-3xl font-bold text-gray-900 dark:text-white tracking-tight'>{value}</p>
      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
    </div>
  );
}

function CategoryBadge({ category }: { category: TxCategory }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyles[category]}`}>
      {category}
    </span>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 shadow-md text-xs'>
        <p className='font-semibold text-gray-700 dark:text-gray-200 mb-0.5'>{label}</p>
        <p className='text-blue-600 dark:text-blue-400'>£{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FinancialTrackingPage() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Financial Tracking
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Income, expenses and tax preparation
          </p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <Plus className='size-4' />
          Add Transaction
        </button>
      </div>

      {/* Stat cards */}
      <div className='flex gap-4 flex-wrap'>
        <StatCard
          iconBg='bg-emerald-100 dark:bg-emerald-900/30'
          icon={<TrendingUp className='size-5 text-emerald-600 dark:text-emerald-400' />}
          value='£51,000'
          label='YTD Income'
        />
        <StatCard
          iconBg='bg-red-100 dark:bg-red-900/30'
          icon={<TrendingDown className='size-5 text-red-500 dark:text-red-400' />}
          value='£18,450'
          label='YTD Expenses'
        />
        <StatCard
          iconBg='bg-blue-100 dark:bg-blue-900/30'
          icon={<Calculator className='size-5 text-blue-600 dark:text-blue-400' />}
          value='£32,550'
          label='Net Profit'
        />
        <StatCard
          iconBg='bg-purple-100 dark:bg-purple-900/30'
          icon={<Percent className='size-5 text-purple-600 dark:text-purple-400' />}
          value='63.8%'
          label='Profit Margin'
        />
      </div>

      {/* Bottom two-column layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {/* Monthly Breakdown chart */}
        <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-5'>
            Monthly Breakdown
          </h2>
          <ResponsiveContainer width='100%' height={320}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id='incomeGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.18} />
                  <stop offset='95%' stopColor='#3b82f6' stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='' stroke='#e5e7eb' strokeOpacity={0.6} vertical={false} />
              <XAxis
                dataKey='month'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                width={52}
                ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                tickFormatter={(v) => `£${v.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type='monotone'
                dataKey='income'
                stroke='#3b82f6'
                strokeWidth={2.5}
                fill='url(#incomeGrad)'
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden'>
          <div className='px-5 py-4 border-b border-gray-100 dark:border-gray-700/50'>
            <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>
              Recent Transactions
            </h2>
          </div>

          {/* Table header */}
          <div className='grid grid-cols-[90px_1fr_130px_80px] gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-700/50'>
            {['DATE', 'DESCRIPTION', 'CATEGORY', 'AMOUNT'].map((h) => (
              <span
                key={h}
                className='text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase last:text-right'
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className='overflow-y-auto max-h-[340px] divide-y divide-gray-50 dark:divide-gray-700/30'>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className='grid grid-cols-[90px_1fr_130px_80px] gap-2 items-center px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors'
              >
                <span className='text-xs text-gray-500 dark:text-gray-400 tabular-nums'>{tx.date}</span>
                <span className='text-xs text-gray-700 dark:text-gray-300 leading-snug'>{tx.description}</span>
                <CategoryBadge category={tx.category} />
                <span
                  className={`text-xs font-bold tabular-nums text-right ${
                    tx.amount < 0
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {formatGBP(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}