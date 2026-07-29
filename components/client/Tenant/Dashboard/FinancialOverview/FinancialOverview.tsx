import { Card } from '@/components/ui/card';
import { getCurrencySign } from '@/utils/formatters';
import { Calendar, Coins, Wallet } from 'lucide-react';
import React from 'react';

interface FinancialData {
  id: string;
  nextRentDueDate: string;
  outstandingBalance: number;
  isPaidInFull: boolean;
  rentAmount: number;
  rentCadence: 'month' | 'week';
}

const financialData: FinancialData[] = [
  {
    id: '1',
    nextRentDueDate: 'August 1, 2026',
    outstandingBalance: 0,
    isPaidInFull: true,
    rentAmount: 1450,
    rentCadence: 'month',
  },
  {
    id: '2',
    nextRentDueDate: 'August 5, 2026',
    outstandingBalance: 320,
    isPaidInFull: false,
    rentAmount: 1200,
    rentCadence: 'month',
  },
  {
    id: '3',
    nextRentDueDate: 'August 3, 2026',
    outstandingBalance: 0,
    isPaidInFull: true,
    rentAmount: 275,
    rentCadence: 'week',
  },
  {
    id: '4',
    nextRentDueDate: 'August 10, 2026',
    outstandingBalance: 890,
    isPaidInFull: false,
    rentAmount: 1600,
    rentCadence: 'month',
  },
  {
    id: '5',
    nextRentDueDate: 'August 1, 2026',
    outstandingBalance: 0,
    isPaidInFull: true,
    rentAmount: 1100,
    rentCadence: 'month',
  },
  {
    id: '6',
    nextRentDueDate: 'August 7, 2026',
    outstandingBalance: 150,
    isPaidInFull: false,
    rentAmount: 310,
    rentCadence: 'week',
  },
  {
    id: '7',
    nextRentDueDate: 'August 2, 2026',
    outstandingBalance: 0,
    isPaidInFull: true,
    rentAmount: 1350,
    rentCadence: 'month',
  },
];

const FinancialOverview: React.FC = () => {
  return (
    <div className='mx-auto w-full max-w-4xl space-y-3 p-4'>
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
                <p className='text-sm font-medium'>{row.nextRentDueDate}</p>
              </div>

              <div>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium'>
                    {getCurrencySign()}
                    {row.outstandingBalance.toFixed(2)}
                  </p>
                </div>
                {row.isPaidInFull && (
                  <p className='mt-2 text-xs text-emerald-500 italic'>
                    Paid in full
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <Coins className='h-4 w-4 text-neutral-400' />
                <p className='text-sm font-medium'>
                  {getCurrencySign()}
                  {row.rentAmount.toFixed(2)} per {row.rentCadence}
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
