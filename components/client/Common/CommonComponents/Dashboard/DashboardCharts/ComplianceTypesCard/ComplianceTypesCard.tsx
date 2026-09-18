'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  COMPLIANCE_TYPE_COLORS,
  FALLBACK_COLOR,
} from '@/data/client/common/Dashboard/DashboardData';
import { useGetDashboardComplianceTypesQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { Activity, PieChartIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import ComplianceTypesCardSkeleton from './ComplianceTypesCardSkeleton';

const shadeColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(
    255,
    Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)),
  );
  const g = Math.min(
    255,
    Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)),
  );
  const b = Math.min(
    255,
    Math.max(0, (num & 0xff) + Math.round(2.55 * percent)),
  );
  return `rgb(${r}, ${g}, ${b})`;
};

const ComplianceTypesCard: React.FC = () => {
  const {
    data: complianceTypesData,
    isLoading,
    isError,
  } = useGetDashboardComplianceTypesQuery();

  if (isLoading) {
    return <ComplianceTypesCardSkeleton />;
  }

  if (isError || !complianceTypesData) {
    return <CustomErrorMessage title='compliance types' />;
  }

  const { data } = complianceTypesData;

  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Activity className='size-4 text-teal-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Compliance Types
          </CardTitle>
        </div>
      </CardHeader>
      {data.length === 0 ? (
        <CardContent className='flex h-full flex-col items-center justify-center gap-2 py-2 text-center'>
          <PieChartIcon className='size-8 text-gray-300 dark:text-gray-600' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No data found
          </p>
        </CardContent>
      ) : (
        <CardContent className='flex flex-col items-center pb-6'>
          <ResponsiveContainer width='100%' height={240}>
            <PieChart>
              <defs>
                {data.map((entry) => {
                  const base =
                    COMPLIANCE_TYPE_COLORS[entry.type] ?? FALLBACK_COLOR;
                  return (
                    <linearGradient
                      key={`grad-${entry.type}`}
                      id={`grad-${entry.type}`}
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='100%'
                    >
                      <stop offset='0%' stopColor={shadeColor(base, 25)} />
                      <stop offset='55%' stopColor={base} />
                      <stop offset='100%' stopColor={shadeColor(base, -25)} />
                    </linearGradient>
                  );
                })}
                <filter
                  id='pie3dShadow'
                  x='-20%'
                  y='-20%'
                  width='140%'
                  height='150%'
                >
                  <feDropShadow
                    dx='0'
                    dy='14'
                    stdDeviation='7'
                    floodColor='#000000'
                    floodOpacity='0.35'
                  />
                </filter>
              </defs>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={0}
                outerRadius={110}
                paddingAngle={2}
                dataKey='percentage'
                nameKey='label'
                startAngle={90}
                endAngle={-270}
                stroke='#fff'
                strokeWidth={1}
                filter='url(#pie3dShadow)'
              >
                {data.map((entry) => (
                  <Cell key={entry.type} fill={`url(#grad-${entry.type})`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className='mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2'>
            {data.map((entry) => (
              <div key={entry.type} className='flex items-center gap-1.5'>
                <span
                  className='inline-block size-3 rounded-sm'
                  style={{
                    backgroundColor:
                      COMPLIANCE_TYPE_COLORS[entry.type] ?? FALLBACK_COLOR,
                  }}
                />
                <span className='text-xs text-gray-600 dark:text-gray-400'>
                  {entry.label} ({entry.count})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ComplianceTypesCard;
