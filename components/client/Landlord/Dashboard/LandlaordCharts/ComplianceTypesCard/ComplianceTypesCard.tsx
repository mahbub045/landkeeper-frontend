'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  COMPLIANCE_TYPE_COLORS,
  FALLBACK_COLOR,
} from '@/data/client/Landlord/dashboard/DashboardData';
import { useGetDashboardComplianceTypesQuery } from '@/store/api/endpoints/client/Landlord/Dashboard/DashboardApi';
import { Activity, PieChartIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import ComplianceTypesCardSkeleton from './ComplianceTypesCardSkeleton';

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
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey='percentage'
                nameKey='label'
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={COMPLIANCE_TYPE_COLORS[entry.type] ?? FALLBACK_COLOR}
                  />
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
