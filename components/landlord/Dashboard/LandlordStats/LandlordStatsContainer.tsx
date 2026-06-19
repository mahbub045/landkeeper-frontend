import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { stats } from "@/data/landlord/dashboard/DashboardData";
import { BadgeVariant } from "@/types/landlord/Dashboard/DashboardTypes";

const badgeStyles: Record<BadgeVariant, string> = {
  up: "bg-success/15 text-success border-transparent",
  down: "bg-danger/15 text-danger border-transparent",
  alert:
    "bg-transparent text-foreground border-transparent font-semibold text-sm shadow-none",
};

const LandlordStatsContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="rounded-2xl border border-border shadow-sm"
          >
            <CardContent className="px-5 py-2">
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>

                {stat.badge && (
                  <Badge
                    variant="outline"
                    className={`rounded-full px-2 py-1 text-xs font-medium ${badgeStyles[
                      stat.badge.variant as BadgeVariant
                    ]}`}
                  >
                    {stat.badge.label}
                  </Badge>
                )}
              </div>

              <p className="mb-1 text-2xl font-bold text-foreground">
                {stat.value}
              </p>

              <p className="text-sm text-muted-foreground">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LandlordStatsContainer;