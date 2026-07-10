'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data for layout showcase — swap for a real category-breakdown
// endpoint once one exists.
const CATEGORY_BREAKDOWN = [
  { name: 'Rental Income', value: 46, color: '#10b981' },
  { name: 'Mortgage Payment', value: 28, color: '#ef4444' },
  { name: 'Repairs', value: 14, color: '#f59e0b' },
  { name: 'Insurance', value: 12, color: '#6366f1' },
];

const CategoryChart: React.FC = () => {
  return (
    <Card className='gap-0'>
      <CardHeader className='border-b pb-4'>
        <CardTitle className='text-base font-semibold'>By category</CardTitle>
      </CardHeader>

      <CardContent className='flex items-center gap-6 pt-4'>
        <div className='h-45 w-45 shrink-0'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={CATEGORY_BREAKDOWN}
                dataKey='value'
                nameKey='name'
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
              >
                {CATEGORY_BREAKDOWN.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${Number(value)}%`, String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className='space-y-2 text-sm'>
          {CATEGORY_BREAKDOWN.map((entry) => (
            <li key={entry.name} className='flex items-center gap-2'>
              <span
                className='size-2.5 shrink-0 rounded-full'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-muted-foreground'>{entry.name}</span>
              <span className='text-foreground ml-auto font-semibold'>
                {entry.value}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
