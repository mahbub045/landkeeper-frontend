'use client';

import { Landmark } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MtdPeriodData } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { getPropertyName } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  HelpfulInfo,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

interface FinanceCostsTabProps {
  data: MtdPeriodData;
  onPending: (label: string) => void;
}

const FinanceCostsTab: React.FC<FinanceCostsTabProps> = ({
  data,
  onPending,
}) => {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <div className='space-y-4'>
        <SectionCard
          icon={Landmark}
          title='Finance costs'
          description='Record your finance costs for each property separately.'
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Mortgage interest (£)</TableHead>
                  <TableHead>Other finance costs (£)</TableHead>
                  <TableHead>Lender / reference</TableHead>
                  <TableHead>Notes / evidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.financeCosts.map((cost) => (
                  <TableRow key={cost.alias}>
                    <TableCell className='text-foreground font-medium'>
                      {getPropertyName(cost.property_alias)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(cost.mortgage_interest)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(cost.other_finance_costs)}
                    </TableCell>
                    <TableCell>{cost.lender_reference}</TableCell>
                    <TableCell className='max-w-40 whitespace-normal'>
                      {cost.evidence}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        onDelete={() => onPending('Delete finance cost')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        </SectionCard>
      </div>

      <div className='space-y-4'>
        <HelpfulInfo
          items={[
            'Record mortgage interest and other finance costs separately for each property.',
            'Residential finance costs can receive different tax treatment from ordinary expenses.',
            'Keep UK and overseas property finance costs separate where required.',
            <>
              Have{' '}
              <strong className='text-foreground'>supporting evidence</strong>{' '}
              for all finance costs (mortgage statements, lender letters, etc.).
            </>,
          ]}
        />
      </div>
    </div>
  );
};

export default FinanceCostsTab;
