import { Card } from '@/components/ui/card';
import { FinancialDataType } from '@/types/client/Tenant/Dashboard/DashboardsTypes';
import { getCurrencySign } from '@/utils/formatters';
import { Calendar, Coins, Wallet } from 'lucide-react';
import React from 'react';

const financialData: FinancialDataType[] = [
  {
    id: '1',
    next_rent_due_date: 'August 1, 2026',
    outstanding_balance: 0,
    is_paid_in_full: true,
    rent_amount: 1450,
    rent_cadence: 'month',
  },
  {
    id: '2',
    next_rent_due_date: 'August 5, 2026',
    outstanding_balance: 320,
    is_paid_in_full: false,
    rent_amount: 1200,
    rent_cadence: 'month',
  },
  {
    id: '3',
    next_rent_due_date: 'August 3, 2026',
    outstanding_balance: 0,
    is_paid_in_full: true,
    rent_amount: 275,
    rent_cadence: 'week',
  },
  {
    id: '4',
    next_rent_due_date: 'August 10, 2026',
    outstanding_balance: 890,
    is_paid_in_full: false,
    rent_amount: 1600,
    rent_cadence: 'month',
  },
  {
    id: '5',
    next_rent_due_date: 'August 1, 2026',
    outstanding_balance: 0,
    is_paid_in_full: true,
    rent_amount: 1100,
    rent_cadence: 'month',
  },
  {
    id: '6',
    next_rent_due_date: 'August 7, 2026',
    outstanding_balance: 150,
    is_paid_in_full: false,
    rent_amount: 310,
    rent_cadence: 'week',
  },
  {
    id: '7',
    next_rent_due_date: 'August 2, 2026',
    outstanding_balance: 0,
    is_paid_in_full: true,
    rent_amount: 1350,
    rent_cadence: 'month',
  },
];

const FinancialOverview: React.FC = () => {
  return (
    <div className='mx-auto w-full max-w-4xl space-y-3'>
      <div className='flex items-center gap-2 text-sm font-medium'>
        <Wallet className='h-4 w-4' />
        Financial overview
      </div>

      <div className='overflow-hidden rounded-xl border'>
        {/* Header row */}
        <div className='grid grid-cols-3 gap-4 border-b px-5 py-3'>
          <p className='text-xs text-neutral-500'>Next rent due date</p>
          <p className='text-xs text-neutral-500'>Outstanding balance</p>
          <p className='text-xs text-neutral-500'>Rent amount</p>
        </div>

        {/* Scrollable data rows */}
        <div className='max-h-105 divide-y overflow-y-auto'>
          {financialData.map((row) => (
            <Card
              key={row.id}
              className='mx-1 my-2 grid grid-cols-3 items-start gap-4 border-x-0 border-t-0 border-b-0 px-2 py-3 shadow-none'
            >
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-neutral-400' />
                <p className='text-sm font-medium'>{row.next_rent_due_date}</p>
              </div>

              <div>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium'>
                    {getCurrencySign()}
                    {row.outstanding_balance.toFixed(2)}
                  </p>
                </div>
                {row.is_paid_in_full && (
                  <p className='mt-2 text-xs text-emerald-500 italic'>
                    Paid in full
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <Coins className='h-4 w-4 text-neutral-400' />
                <p className='text-sm font-medium'>
                  {getCurrencySign()}
                  {row.rent_amount.toFixed(2)} per {row.rent_cadence}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
