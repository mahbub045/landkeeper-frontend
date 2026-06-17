'use client';

import { Card, CardContent } from '@/components/ui/card';
import { summaryStats } from '@/data/landlord/mortgage/MortgageData';
import { SummaryStat } from '@/types/landlord/Mortgage/MortgageTypes';

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: SummaryStat) {
  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardContent className='px-6 py-3'>
        <div
          className={`h-12 w-12 rounded-xl ${iconBg} mb-4 flex items-center justify-center`}
        >
          <Icon className={`size-6 ${iconColor}`} />
        </div>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
          {value}
        </p>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{label}</p>
      </CardContent>
    </Card>
  );
}

const SummaryCards: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {summaryStats.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

export default SummaryCards;
