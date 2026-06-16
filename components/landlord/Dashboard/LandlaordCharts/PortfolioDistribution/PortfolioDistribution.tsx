'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioData } from '@/data/landlord/dashboard/DashboardData';
import { PieChartIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export default function PortfolioDistribution() {
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