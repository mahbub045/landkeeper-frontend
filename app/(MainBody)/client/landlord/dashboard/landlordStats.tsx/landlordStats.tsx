import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  PoundSterling,
  Landmark,
  TriangleAlert,
  Percent,
  Users,
} from 'lucide-react';

type BadgeVariant = 'up' | 'down' | 'alert';

interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: {
    label: string;
    variant: BadgeVariant;
  };
}

const stats: StatCard[] = [
  {
    title: 'Total Properties',
    value: '5',
    icon: Home,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
    badge: { label: '↑ 2', variant: 'up' },
  },
  {
    title: 'Monthly Rental Income',
    value: '£4,250',
    icon: PoundSterling,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-500',
    badge: { label: '↑ 5.2%', variant: 'up' },
  },
  {
    title: 'Mortgage Payments',
    value: '£1,680',
    icon: Landmark,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    badge: { label: '↓ 1.2%', variant: 'down' },
  },
  {
    title: 'Compliance Issues',
    value: '2',
    icon: TriangleAlert,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
    badge: { label: '2 Alerts', variant: 'alert' },
  },
  {
    title: 'Profit Margin',
    value: '63.8%',
    icon: Percent,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-500',
    badge: { label: '↑ 63.8%', variant: 'up' },
  },
  {
    title: 'Occupancy Rate',
    value: '8/8',
    icon: Users,
    iconBg: 'bg-teal-100 dark:bg-teal-900/30',
    iconColor: 'text-teal-500',
    badge: { label: '↑ 100%', variant: 'up' },
  },
];

const badgeStyles: Record<BadgeVariant, string> = {
  up: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  down: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  alert: 'text-gray-800 dark:text-gray-200 font-semibold text-sm',
};

export default function LandlordStats() {
  return (
    <div className='grid gap-4 grid-cols-2 xl:grid-cols-4'>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'
          >
            <CardContent className='px-5 py-2'>
              <div className='flex items-start justify-between mb-4'>
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                {stat.badge && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${badgeStyles[stat.badge.variant]}`}
                  >
                    {stat.badge.label}
                  </span>
                )}
              </div>
              <p className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
                {stat.value}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{stat.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}