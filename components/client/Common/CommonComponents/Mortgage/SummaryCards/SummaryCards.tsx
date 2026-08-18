'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import { getCurrencySign } from '@/utils/formatters';
import { Building2, CreditCard, TrendingDown } from 'lucide-react';

const SummaryCards: React.FC<{ data: Mortgage[] }> = ({ data }) => {
  const totalOutstanding = data.reduce(
    (sum, m) => sum + parseFloat(m.outstanding_balance ?? '0'),
    0,
  );
  const totalMonthly = data.reduce(
    (sum, m) => sum + parseFloat(m.monthly_payment ?? '0'),
    0,
  );
  const count = data.length;

  const stats = [
    {
      label: 'Total Outstanding',
      value: `${getCurrencySign()}${totalOutstanding.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
      icon: TrendingDown,
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
    },
    {
      label: 'Monthly Payments',
      value: `${getCurrencySign()}${totalMonthly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`,
      icon: CreditCard,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Active Mortgages',
      value: count.toString(),
      icon: Building2,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {stats.map((stat) => (
        <Card key={stat.label} className='border-border rounded-2xl shadow-lg'>
          <CardContent className='px-6 py-3'>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <stat.icon className={`size-6 ${stat.iconColor}`} />
            </div>
            <p className='text-foreground text-2xl font-bold'>{stat.value}</p>
            <p className='text-muted-foreground mt-1 text-sm'>{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
