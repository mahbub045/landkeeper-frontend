'use client';

import { monthlyData } from '@/data/landlord/finance/FinanceData';
import { TooltipProps } from '@/types/landlord/Finance/FinanceTypes';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-md dark:border-gray-700 dark:bg-gray-800'>
        <p className='mb-0.5 font-semibold text-gray-700 dark:text-gray-200'>
          {label}
        </p>
        <p className='text-blue-600 dark:text-blue-400'>
          £{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

const MonthlyChart: React.FC = () => {
  return (
    <div className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'>
      <h2 className='mb-5 text-sm font-semibold text-gray-900 dark:text-white'>
        Monthly Breakdown
      </h2>
      <ResponsiveContainer width='100%' height={320}>
        <AreaChart
          data={monthlyData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='incomeGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.18} />
              <stop offset='95%' stopColor='#3b82f6' stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray=''
            stroke='#e5e7eb'
            strokeOpacity={0.6}
            vertical={false}
          />
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
  );
};

export default MonthlyChart;
