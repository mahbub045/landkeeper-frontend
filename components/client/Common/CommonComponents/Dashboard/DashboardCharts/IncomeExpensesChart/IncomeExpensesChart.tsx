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
import {
  CylinderBarProps,
  CylinderPinLabelProps,
  CylinderTheme,
  IncomeExpenseMonths,
  IncomeExpenseSummaryItem,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import { formatCurrency } from '@/utils/formatters';
import { BarChart2, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useId, useState, useSyncExternalStore } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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

// Pin labels get crowded beyond this many months
const MAX_PIN_LABEL_MONTHS = 6;

const INCOME_COLORS = {
  base: '#22c55e',
  light: '#4ade80',
  dark: '#15803d',
  top: '#166534',
};

const EXPENSE_COLORS = {
  base: '#ef4444',
  light: '#f87171',
  dark: '#b91c1c',
  top: '#7f1d1d',
};

// Flattened ellipse height relative to bar width
const ellipseRy = (width: number) => Math.max(width * 0.2, 2);

const CylinderBar = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  theme,
}: CylinderBarProps) => {
  if (width <= 0) return null;
  const cx = x + width / 2;
  const rx = width / 2;
  const ry = ellipseRy(width);
  const bottom = y + height;
  return (
    <g>
      {/* Ground shadow */}
      <ellipse
        cx={cx}
        cy={bottom}
        rx={rx * 1.35}
        ry={ry * 1.2}
        fill='#9ca3af'
        opacity={0.3}
      />
      {height > 0 && (
        <>
          <ellipse
            cx={cx}
            cy={bottom}
            rx={rx}
            ry={ry}
            fill={`url(#${theme.gradientId})`}
          />
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={`url(#${theme.gradientId})`}
          />
        </>
      )}
      {/* Open top */}
      <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={theme.top} />
    </g>
  );
};

const CylinderPinLabel = ({
  x = 0,
  y = 0,
  width = 0,
  value = 0,
  color,
}: CylinderPinLabelProps) => {
  const barWidth = Number(width);
  const cx = Number(x) + barWidth / 2;
  const top = Number(y) - ellipseRy(barWidth);
  return (
    <g className='pointer-events-none'>
      <text
        x={cx}
        y={top - 6}
        textAnchor='middle'
        fill={color}
        className='text-[11px] font-bold'
      >
        {formatYAxis(Number(value))}
      </text>
      <line
        x1={cx}
        y1={top - 20}
        x2={cx}
        y2={top - 30}
        className='stroke-gray-500 dark:stroke-gray-400'
      />
      <circle
        cx={cx}
        cy={top - 32}
        r={2.5}
        className='fill-gray-700 dark:fill-gray-300'
      />
    </g>
  );
};

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
  const gradientPrefix = useId().replace(/:/g, '');
  const incomeTheme: CylinderTheme = {
    gradientId: `${gradientPrefix}-income`,
    top: INCOME_COLORS.top,
  };
  const expenseTheme: CylinderTheme = {
    gradientId: `${gradientPrefix}-expense`,
    top: EXPENSE_COLORS.top,
  };

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

  const net = Number(incomeExpenses?.net);

  const summary: IncomeExpenseSummaryItem[] = [
    {
      title: 'Total Income',
      value: formatCurrency(Number(incomeExpenses?.total_income)),
      icon: TrendingUp,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-500',
      valueColor: 'text-foreground',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(Number(incomeExpenses?.total_expense)),
      icon: TrendingDown,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-500',
      valueColor: 'text-foreground',
    },
    {
      title: 'Net',
      value: formatCurrency(net),
      icon: Wallet,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-500',
      valueColor:
        net < 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground',
    },
  ];

  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const legendColor = isDark ? '#9ca3af' : '#6b7280';
  const showPinLabels = chartData.length <= MAX_PIN_LABEL_MONTHS;

  return (
    <Card className='border-border rounded-2xl shadow-md'>
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
          <SelectTrigger size='sm' className='h-8! w-36'>
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
          <>
            <div className='mb-4 grid grid-cols-3 gap-3'>
              {summary.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className='border-border flex items-center gap-2.5 rounded-xl border px-3 py-2 shadow-sm'
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                    >
                      <Icon className={`size-4 ${item.iconColor}`} />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-muted-foreground truncate text-xs'>
                        {item.title}
                      </p>
                      <p
                        className={`truncate text-sm font-bold sm:text-base ${item.valueColor}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <ResponsiveContainer width='100%' height={320}>
              <BarChart
                data={chartData}
                barCategoryGap='25%'
                barGap={6}
                margin={{ top: showPinLabels ? 44 : 16, right: 8 }}
              >
                <defs>
                  {[
                    { id: incomeTheme.gradientId, colors: INCOME_COLORS },
                    { id: expenseTheme.gradientId, colors: EXPENSE_COLORS },
                  ].map(({ id, colors }) => (
                    // Horizontal shading gives the bars a rounded, cylindrical look
                    <linearGradient
                      key={id}
                      id={id}
                      x1='0'
                      y1='0'
                      x2='1'
                      y2='0'
                    >
                      <stop offset='0%' stopColor={colors.dark} />
                      <stop offset='45%' stopColor={colors.light} />
                      <stop offset='100%' stopColor={colors.dark} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey='month'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickColor, fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickColor, fontSize: 12 }}
                  tickCount={6}
                />
                <Legend
                  iconType='circle'
                  iconSize={10}
                  wrapperStyle={{
                    paddingTop: 16,
                    fontSize: 13,
                    color: legendColor,
                  }}
                />
                <Bar
                  dataKey='income'
                  name='Income'
                  fill={INCOME_COLORS.base}
                  maxBarSize={36}
                  shape={(props: Omit<CylinderBarProps, 'theme'>) => (
                    <CylinderBar {...props} theme={incomeTheme} />
                  )}
                >
                  {showPinLabels && (
                    <LabelList
                      dataKey='income'
                      content={(props) => (
                        <CylinderPinLabel
                          x={props.x}
                          y={props.y}
                          width={props.width}
                          value={props.value as number}
                          color={INCOME_COLORS.dark}
                        />
                      )}
                    />
                  )}
                </Bar>
                <Bar
                  dataKey='expenses'
                  name='Expenses'
                  fill={EXPENSE_COLORS.base}
                  maxBarSize={36}
                  shape={(props: Omit<CylinderBarProps, 'theme'>) => (
                    <CylinderBar {...props} theme={expenseTheme} />
                  )}
                >
                  {showPinLabels && (
                    <LabelList
                      dataKey='expenses'
                      content={(props) => (
                        <CylinderPinLabel
                          x={props.x}
                          y={props.y}
                          width={props.width}
                          value={props.value as number}
                          color={EXPENSE_COLORS.dark}
                        />
                      )}
                    />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeExpensesChart;
