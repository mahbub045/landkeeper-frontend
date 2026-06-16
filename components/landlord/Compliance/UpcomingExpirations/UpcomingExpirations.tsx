"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingExpirationsProps } from "@/types/landlord/Compliance/ComplianceTypes";

export default function UpcomingExpirations({
  items,
}: UpcomingExpirationsProps) {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
          Upcoming Expirations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 px-4 pb-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-4 ${
                idx < items.length - 1
                  ? "border-b border-gray-100 dark:border-gray-700/50"
                  : ""
              }`}
            >
              <div className={`rounded-full p-2.5 ${item.iconBg} shrink-0`}>
                <Icon className={`size-4 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
