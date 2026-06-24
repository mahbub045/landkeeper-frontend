'use client';

import { Card, CardContent } from '@/components/ui/card';
import { summaryStats } from '@/data/client/common/mortgage/MortgageData';
import { SummaryStat } from '@/types/client/Common/Mortgage/MortgageTypes';

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: SummaryStat) {
  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardContent className='px-6 py-3'>
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`size-6 ${iconColor}`} />
        </div>
        <p className='text-foreground text-2xl font-bold'>{value}</p>
        <p className='text-muted-foreground mt-1 text-sm'>{label}</p>
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
