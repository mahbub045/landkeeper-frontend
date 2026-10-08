import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

const BAR_HEIGHTS = [
  ['60%', '40%'],
  ['75%', '50%'],
  ['45%', '65%'],
  ['85%', '55%'],
  ['55%', '35%'],
  ['70%', '60%'],
];

export function IncomeExpensesChartBars() {
  return (
    <>
      <div className='mb-4 grid grid-cols-3 gap-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='border-border flex items-center gap-2.5 rounded-xl border px-3 py-2 shadow-sm'
          >
            <div className='bg-muted size-8 shrink-0 animate-pulse rounded-lg' />
            <div className='space-y-1.5'>
              <div className='bg-muted h-3 w-16 animate-pulse rounded' />
              <div className='bg-muted h-4 w-20 animate-pulse rounded' />
            </div>
          </div>
        ))}
      </div>
      <div className='flex h-70 w-full flex-col'>
        <div className='flex flex-1 items-end justify-around gap-4 border-b border-gray-100 px-4 dark:border-gray-700/50'>
          {BAR_HEIGHTS.map(([income, expense], i) => (
            <div key={i} className='flex h-full items-end gap-1'>
              <div
                className='bg-muted w-4 animate-pulse rounded-t-sm sm:w-6'
                style={{ height: income }}
              />
              <div
                className='bg-muted w-4 animate-pulse rounded-t-sm sm:w-6'
                style={{ height: expense }}
              />
            </div>
          ))}
        </div>
        <div className='mt-4 flex items-center justify-center gap-6'>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className='flex items-center gap-1.5'>
              <span className='bg-muted inline-block size-3 animate-pulse rounded-sm' />
              <span className='bg-muted h-3 w-16 animate-pulse rounded' />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function IncomeExpensesChartSkeleton() {
  return (
    <Card className='border-border rounded-2xl shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div className='flex items-center gap-2'>
          <BarChart2 className='text-primary size-4' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Income vs Expenses
          </CardTitle>
        </div>
        <div className='bg-muted h-7 w-36 animate-pulse rounded-lg' />
      </CardHeader>
      <CardContent className='pt-2 pb-4'>
        <IncomeExpensesChartBars />
      </CardContent>
    </Card>
  );
}
