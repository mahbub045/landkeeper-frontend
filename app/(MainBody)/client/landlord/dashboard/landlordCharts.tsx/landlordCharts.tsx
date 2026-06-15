'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Bell,
  Clock,
  Activity,
  PieChart as PieChartIcon,
  BarChart2,
  AlertCircle,
  RefreshCw,
  FileText,
  Upload,
  PoundSterling,
  Wrench,
  UserPlus,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

// ── Income vs Expenses data ──────────────────────────────────────────────────
const incomeExpensesData = [
  { month: 'Jan', income: 4150, expenses: 1580 },
  { month: 'Feb', income: 4150, expenses: 1520 },
  { month: 'Mar', income: 4200, expenses: 1640 },
  { month: 'Apr', income: 4150, expenses: 1600 },
  { month: 'May', income: 4250, expenses: 1560 },
  { month: 'Jun', income: 4200, expenses: 1510 },
];

// ── Alerts & Reminders data ──────────────────────────────────────────────────
interface AlertItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

const alerts: AlertItem[] = [
  {
    id: 1,
    icon: AlertCircle,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
    title: 'Gas Safety Certificate Expired',
    subtitle: '14 Oak Street · Expired 3 days ago',
  },
  {
    id: 2,
    icon: Clock,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    title: 'EPC Renewal Due',
    subtitle: '42 Maple Avenue · Expires in 14 days',
  },
  {
    id: 3,
    icon: RefreshCw,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-400',
    title: 'Mortgage Renewal',
    subtitle: '8 Pine Road · Fixed term ends in 45 days',
  },
  {
    id: 4,
    icon: FileText,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    title: 'Tenancy Renewal',
    subtitle: "23 Elm Drive · Sarah Johnson's lease ends in 30 days",
  },
];

// ── Recent Activity data ─────────────────────────────────────────────────────
interface ActivityItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  title: string;
  titleColor: string;
  subtitle: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: 1,
    icon: Upload,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
    accentColor: 'bg-blue-500',
    title: 'Document Uploaded',
    titleColor: 'text-blue-600 dark:text-blue-400',
    subtitle: 'Tenancy Agreement · 14 Oak Street',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: PoundSterling,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-500',
    accentColor: 'bg-emerald-500',
    title: 'Rent Received',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
    subtitle: '£850 from Sarah Johnson · 14 Oak Street',
    time: '5 hours ago',
  },
  {
    id: 3,
    icon: Wrench,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    accentColor: 'bg-amber-500',
    title: 'Maintenance Request',
    titleColor: 'text-amber-600 dark:text-amber-400',
    subtitle: 'Plumbing issue reported · 42 Maple Avenue',
    time: '1 day ago',
  },
  {
    id: 4,
    icon: UserPlus,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500',
    accentColor: 'bg-purple-500',
    title: 'New Tenant Added',
    titleColor: 'text-purple-600 dark:text-purple-400',
    subtitle: 'Michael Brown · 8 Pine Road',
    time: '2 days ago',
  },
];

// ── Portfolio Distribution data ──────────────────────────────────────────────
const portfolioData = [
  { name: 'Residential', value: 55, color: '#4f6ef7' },
  { name: 'HMO', value: 25, color: '#f59e0b' },
  { name: 'Commercial', value: 20, color: '#a78bfa' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatYAxis = (value: number) => `£${(value / 1000).toFixed(0)}k`;

// Hook to safely read resolved theme (avoids SSR mismatch without setState-in-effect)
function useResolvedTheme() {
  const { resolvedTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return isMounted ? resolvedTheme : 'light';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function IncomeExpensesChart() {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const legendColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='flex items-center gap-2'>
          <BarChart2 className='size-4 text-blue-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Income vs Expenses
          </CardTitle>
        </div>
        <div className='flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
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
              wrapperStyle={{ paddingTop: 16, fontSize: 13, color: legendColor }}
            />
            <Bar dataKey='income' name='Income' fill='#22c55e' radius={[3, 3, 0, 0]} />
            <Bar dataKey='expenses' name='Expenses' fill='#ef4444' radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function AlertsReminders() {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Bell className='size-4 text-amber-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Alerts &amp; Reminders
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-4 space-y-0'>
        {alerts.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 py-3 ${
                idx < alerts.length - 1
                  ? 'border-b border-gray-100 dark:border-gray-700/50'
                  : ''
              }`}
            >
              <div className={`p-2 rounded-full ${alert.iconBg} shrink-0`}>
                <Icon className={`size-4 ${alert.iconColor}`} />
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                  {alert.title}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                  {alert.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Activity className='size-4 text-teal-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-4 space-y-0'>
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className='flex items-start gap-3 py-3 relative'>
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${activity.accentColor}`}
              />
              <div className={`ml-3 p-2 rounded-full ${activity.iconBg} shrink-0`}>
                <Icon className={`size-4 ${activity.iconColor}`} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className={`text-sm font-semibold ${activity.titleColor}`}>
                  {activity.title}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate'>
                  {activity.subtitle}
                </p>
              </div>
              <p className='text-xs text-gray-400 dark:text-gray-500 shrink-0'>
                {activity.time}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function PortfolioDistribution() {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <PieChartIcon className='size-4 text-indigo-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Portfolio Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col items-center pb-6'>
        <ResponsiveContainer width='100%' height={240}>
          <PieChart>
            <Pie
              data={portfolioData}
              cx='50%'
              cy='50%'
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey='value'
              startAngle={90}
              endAngle={-270}
            >
              {portfolioData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className='flex items-center gap-6 mt-2'>
          {portfolioData.map((entry) => (
            <div key={entry.name} className='flex items-center gap-1.5'>
              <span
                className='inline-block size-3 rounded-sm'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-xs text-gray-600 dark:text-gray-400'>{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function LandlordCharts() {
  return (
    <div className='grid gap-4 grid-cols-1 xl:grid-cols-2'>
      <IncomeExpensesChart />
      <AlertsReminders />
      <RecentActivity />
      <PortfolioDistribution />
    </div>
  );
}