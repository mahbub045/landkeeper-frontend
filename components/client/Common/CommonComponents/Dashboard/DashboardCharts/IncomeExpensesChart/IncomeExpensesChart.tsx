'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDashboardIncomeExpenseQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { IncomeExpenseMonths } from '@/types/client/Common/Dashboard/DashboardTypes';
import { BarChart2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import IncomeExpensesChartSkeleton, {
  IncomeExpensesChartBars,
} from './IncomeExpensesChartSkeleton';

const MONTH_OPTIONS: IncomeExpenseMonths[] = [3, 6, 12];

const formatYAxis = (value: number) =>
  Math.abs(value) >= 1000 ? `£${(value / 1000).toFixed(0)}k` : `£${value}`;

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
  const [months, setMonths] = useState<IncomeExpenseMonths>(6);

  const {
    data: incomeExpenses,
    isLoading,
    isFetching,
    isError,
  } = useGetDashboardIncomeExpenseQuery({ months });

  if (isLoading) {
    return <IncomeExpensesChartSkeleton />;
  }

  const chartData =
    incomeExpenses?.data.map((item) => ({
      month: item.label,
      income: Number(item.income),
      expenses: Number(item.expense),
    })) ?? [];

  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const legendColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='flex items-center gap-2'>
          <BarChart2 className='text-primary size-4' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Income vs Expenses
          </CardTitle>
        </div>
        <Select
          value={String(months)}
          onValueChange={(v) => setMonths(Number(v) as IncomeExpenseMonths)}
        >
          <SelectTrigger size='sm' className='w-36 h-8!'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper' align='end'>
            {MONTH_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                Last {option} Months
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='pt-2 pb-4'>
        {isFetching ? (
          <IncomeExpensesChartBars />
        ) : isError || !incomeExpenses ? (
          <CustomErrorMessage title='income vs expenses' />
        ) : (
          <ResponsiveContainer width='100%' height={280}>
            <BarChart data={chartData} barCategoryGap='30%' barGap={4}>
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
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeExpensesChart;
