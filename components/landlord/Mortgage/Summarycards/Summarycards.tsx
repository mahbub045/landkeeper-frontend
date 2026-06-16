'use client';

import { Card, CardContent } from '@/components/ui/card';
import { summaryStats } from '@/data/landlord/mortgage/MortgageData';
import { SummaryStat } from '@/types/landlord/Mortgage/MortgageTypes';


function SummaryCard({ label, value, icon: Icon, iconBg, iconColor }: SummaryStat) {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardContent className='px-6 py-3'>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
          <Icon className={`size-6 ${iconColor}`} />
        </div>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{value}</p>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
      </CardContent>
    </Card>
  );
}

export default function SummaryCards() {
  return (
    <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
      {summaryStats.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}