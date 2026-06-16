"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceScoreProps } from '@/types/landlord/Compliance/ComplianceTypes';

function DonutChart({ percent }: { percent: number }) {
  const r = 70;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const filled = (percent / 100) * circumference;

  return (
    <svg viewBox="0 0 200 200" className="h-44 w-44">
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        className="text-gray-200 dark:text-gray-700"
      />
      {/* Fill */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Label */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-900 dark:fill-white"
        style={{ fontSize: 28, fontWeight: 700 }}
      >
        {percent}%
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-500 dark:fill-gray-400"
        style={{ fontSize: 13 }}
      >
        Compliant
      </text>
    </svg>
  );
}

export default function ComplianceScore({
  percent,
  validCount,
  totalCount,
  breakdown,
}: ComplianceScoreProps) {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
          Compliance Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pb-6">
        <DonutChart percent={percent} />

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {validCount} of {totalCount} properties have valid certificates
        </p>

        <div className="mt-2 w-full space-y-4">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.current}/{item.total}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${item.color} transition-all`}
                  style={{ width: `${(item.current / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
