'use client';

import { FileSpreadsheet } from 'lucide-react';

import Loading from '@/components/common/CustomLoader/Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getReportScopeLabel } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { cn } from '@/lib/utils';
import { useGetMTDSummaryQuery } from '@/store/api/endpoints/client/Common/MakingTaxDigital/MakingTaxDigitalApi';
import {
  MtdReportTabProps,
  MtdSummary,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import DownloadSummaryCard from '../Shared/DownloadSummaryCard';
import {
  HelpfulInfo,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

const SummaryTab: React.FC<MtdReportTabProps> = ({ report }) => {
  const { data, isFetching } = useGetMTDSummaryQuery(
    { reportAlias: report?.alias },
    { skip: !report },
  );
  const summary: MtdSummary | undefined = data;

  const rentalIncome = summary?.total_rental_income ?? 0;
  const otherIncome = summary?.total_other_income ?? 0;
  const income = summary?.total_income ?? 0;
  const expenses = summary?.total_allowable_expenses ?? 0;
  const profit = summary?.property_profit ?? 0;
  const mortgageInterest = summary?.total_mortgage_interest ?? 0;
  const included = summary?.number_of_properties_included ?? 0;
  const scope = getReportScopeLabel(summary);

  const rows = [
    {
      category: 'Total rental income',
      amount: toAmount(rentalIncome),
      notes: `From ${scope}`,
    },
    {
      category: 'Total other property income',
      amount: toAmount(otherIncome),
      notes: 'Includes parking, utilities etc.',
    },
    {
      category: 'TOTAL PROPERTY INCOME',
      amount: toAmount(income),
      notes: 'Sum of rental and other income',
      emphasis: true,
    },
    {
      category: 'Total allowable property expenses',
      amount: toAmount(expenses),
      notes: 'Excludes finance costs',
    },
    {
      category:
        'NET PROPERTY PROFIT / (LOSS) before finance-cost tax treatment',
      amount: toAmount(profit),
      notes: 'Income minus allowable expenses',
      emphasis: true,
    },
    {
      category: 'Total residential finance costs (separately recorded)',
      amount: toAmount(mortgageInterest),
      notes: 'Mortgage and other finance costs',
    },
    {
      category: 'Number of properties included',
      amount: String(included),
      notes: 'Properties in this report',
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <SectionCard
          icon={FileSpreadsheet}
          title='MTD Summary'
          description={`Quarterly updates and annual totals for ${scope}.`}
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount (£)</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className='flex justify-center py-6'>
                        <Loading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.category}
                      className={cn(
                        row.emphasis &&
                          'bg-blue-50/60 font-semibold text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
                      )}
                    >
                      <TableCell className='whitespace-normal'>
                        {row.category}
                      </TableCell>
                      <TableCell className='tabular-nums'>
                        {row.amount}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {row.notes}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        </SectionCard>

        <div>
          <HelpfulInfo
            items={[
              'Make sure all income and expenses are included for the correct tax quarter.',
              'Check that finance costs are recorded separately and not deducted from rental profit.',
              'Keep UK and overseas property business figures separate where required.',
              'Review your summary before submitting to HMRC.',
            ]}
          />
        </div>
      </div>

      <DownloadSummaryCard report={report} />
    </div>
  );
};

export default SummaryTab;
