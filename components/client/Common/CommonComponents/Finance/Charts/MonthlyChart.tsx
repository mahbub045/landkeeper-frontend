'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { monthlyData } from '@/data/client/common/finance/FinanceData';
import { TooltipProps } from '@/types/client/Common/Finance/FinanceTypes';

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className='border-border bg-card rounded-lg border p-3 shadow-md'>
        <p className='text-foreground text-sm font-medium'>{label}</p>

        <p className='text-primary mt-1 text-sm'>
          £{Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
}

const MonthlyChart: React.FC = () => {
  return (
    <Card>
      <CardHeader className='border-b pb-2'>
        <CardTitle className='text-base font-semibold'>
          Monthly Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className='h-80 w-full'>
          <ResponsiveContainer
            width='100%'
            height='100%'
            initialDimension={{ width: 320, height: 320 }}
          >
            <AreaChart
              data={monthlyData}
              margin={{
                top: 4,
                right: 4,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id='incomeGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--primary)'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--primary)'
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke='var(--border)'
                strokeDasharray='3 3'
                vertical={false}
              />

              <XAxis
                dataKey='month'
                axisLine={false}
                tickLine={false}
                dy={8}
                tick={{
                  fontSize: 12,
                  fill: 'var(--muted-foreground)',
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={52}
                ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                tickFormatter={(value) => `£${value.toLocaleString()}`}
                tick={{
                  fontSize: 11,
                  fill: 'var(--muted-foreground)',
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type='monotone'
                dataKey='income'
                stroke='var(--primary)'
                strokeWidth={2.5}
                fill='url(#incomeGrad)'
                dot={{
                  r: 4,
                  fill: 'var(--primary)',
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: 'var(--primary)',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
