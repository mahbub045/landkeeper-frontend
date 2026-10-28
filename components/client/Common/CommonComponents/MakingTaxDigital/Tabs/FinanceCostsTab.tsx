'use client';

import { Landmark, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MtdTabProps } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import {
  getPropertyName,
  getScopeLabel,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  HelpfulInfo,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

const FinanceCostsTab: React.FC<MtdTabProps> = ({
  data,
  properties,
  onPending,
}) => {
  // One property needs no per-row property column
  const showProperty = properties.length > 1;

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <div className='space-y-4'>
        <SectionCard
          icon={Landmark}
          title='Finance costs'
          description={`Finance costs recorded for ${getScopeLabel(properties)}.`}
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  {showProperty && <TableHead>Property</TableHead>}
                  <TableHead>Mortgage interest (£)</TableHead>
                  <TableHead>Other finance costs (£)</TableHead>
                  <TableHead>Lender / reference</TableHead>
                  <TableHead>Notes / evidence</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.financeCosts.map((cost) => (
                  <TableRow key={cost.alias}>
                    {showProperty && (
                      <TableCell className='text-foreground font-medium'>
                        {getPropertyName(cost.property_alias)}
                      </TableCell>
                    )}
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
                    <TableCell className='text-center'>
                      <Button
                        variant='destructive'
                        size='icon-sm'
                        aria-label='Delete'
                        onClick={() => onPending('Delete finance cost')}
                      >
                        <Trash2 />
                      </Button>
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
