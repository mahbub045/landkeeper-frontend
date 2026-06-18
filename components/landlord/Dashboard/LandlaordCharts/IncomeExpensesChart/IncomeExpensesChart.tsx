'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { incomeExpensesData } from '@/data/landlord/dashboard/DashboardData';
import { BarChart2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const formatYAxis = (value: number) => `£${(value / 1000).toFixed(0)}k`;

function useResolvedTheme() {
  const { resolvedTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return isMounted ? resolvedTheme : 'light';
}

const IncomeExpensesChart: React.FC = () => {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const legendColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='flex items-center gap-2'>
          <BarChart2 className='size-4 text-primary' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Income vs Expenses
          </CardTitle>
        </div>
        <div className='flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50'>
          Last 6 Months
          <span className='ml-1 text-gray-400 dark:text-gray-500'>▾</span>
        </div>
      </CardHeader>
      <CardContent className='pt-2 pb-4'>
        <ResponsiveContainer width='100%' height={280}>
          <BarChart data={incomeExpensesData} barCategoryGap='30%' barGap={4}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
              tickCount={6}
            />
            <Legend
              iconType='square'
              iconSize={12}
              wrapperStyle={{
                paddingTop: 16,
                fontSize: 13,
                color: legendColor,
              }}
            />
            <Bar
              dataKey='income'
              name='Income'
              fill='#22c55e'
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey='expenses'
              name='Expenses'
              fill='#ef4444'
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeExpensesChart;
