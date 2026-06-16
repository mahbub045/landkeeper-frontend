import { Card, CardContent } from "@/components/ui/card";
import { stats } from '@/data/landlord/dashboard/DashboardData';
import { BadgeVariant } from '@/types/landlord/Dashboard/DashboardTypes';

const badgeStyles: Record<BadgeVariant, string> = {
  up: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  down: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  alert: "text-gray-800 dark:text-gray-200 font-semibold text-sm",
};

export default function LandlordStatsContainer() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50"
          >
            <CardContent className="px-5 py-2">
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                {stat.badge && (
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${badgeStyles[stat.badge.variant as BadgeVariant]}`}
                  >
                    {stat.badge.label}
                  </span>
                )}
              </div>
              <p className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
