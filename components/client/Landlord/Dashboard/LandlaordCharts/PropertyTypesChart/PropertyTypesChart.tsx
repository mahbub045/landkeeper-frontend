'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FALLBACK_COLOR,
  PROPERTY_TYPE_COLORS,
} from '@/data/client/Landlord/dashboard/DashboardData';
import { useGetDashboardPropertyTypesQuery } from '@/store/api/endpoints/client/Landlord/Dashboard/DashboardApi';
import { PieChartIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import PropertyTypesChartSkeleton from './PropertyTypesChartSkeleton';

const PropertyTypesChart: React.FC = () => {
  const {
    data: propertyTypesData,
    isLoading,
    isError,
  } = useGetDashboardPropertyTypesQuery();

  if (isLoading) {
    return <PropertyTypesChartSkeleton />;
  }

  if (isError || !propertyTypesData) {
    return <CustomErrorMessage title='property types' />;
  }

  const { data } = propertyTypesData;

  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <PieChartIcon className='size-4 text-indigo-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Property Types
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
                    fill={PROPERTY_TYPE_COLORS[entry.type] ?? FALLBACK_COLOR}
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
                      PROPERTY_TYPE_COLORS[entry.type] ?? FALLBACK_COLOR,
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

export default PropertyTypesChart;
