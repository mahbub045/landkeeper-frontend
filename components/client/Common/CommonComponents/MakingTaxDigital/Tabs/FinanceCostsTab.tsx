'use client';

import { BarChart3, Home, Landmark, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getPortfolioTotals,
  getPropertyName,
  MTD_FINANCE_COSTS,
  MTD_PROPERTIES,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  HelpfulInfo,
  InfoNote,
  QuickAction,
  QuickActions,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
  TotalsBar,
} from '../Shared/MtdShared';

interface FinanceCostsTabProps {
  quickActions: QuickAction[];
  onPending: (label: string) => void;
}

const FinanceCostsTab: React.FC<FinanceCostsTabProps> = ({
  quickActions,
  onPending,
}) => {
  const [propertyFilter, setPropertyFilter] = useState('all');
  const totals = getPortfolioTotals();
  const costs = MTD_FINANCE_COSTS.filter(
    (c) => propertyFilter === 'all' || c.property_alias === propertyFilter,
  );

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <div className='space-y-4'>
        <SectionCard
          icon={Landmark}
          title='Finance costs'
          description='Record your finance costs for each property separately.'
          action={
            <>
              <Button onClick={() => onPending('Add finance cost')}>
                <Plus /> Add finance cost
              </Button>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className='w-40'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All properties</SelectItem>
                  {MTD_PROPERTIES.map((p) => (
                    <SelectItem key={p.alias} value={p.alias}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          }
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
                {costs.map((cost) => (
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
                        onEdit={() => onPending('Edit finance cost')}
                        onDelete={() => onPending('Delete finance cost')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
          <TotalsBar
            icon={BarChart3}
            title='Total finance costs'
            items={[
              {
                label: 'Total mortgage interest',
                value: toAmount(totals.mortgageInterest),
              },
              {
                label: 'Total other finance costs',
                value: toAmount(totals.otherFinanceCosts),
              },
              {
                label: 'Total finance costs',
                value: toAmount(totals.financeCosts),
                highlight: true,
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          icon={Home}
          title={
            <>
              Residential finance costs{' '}
              <span className='font-normal text-blue-600 dark:text-blue-400'>
                (record separately)
              </span>
            </>
          }
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {MTD_FINANCE_COSTS.map((cost) => (
                  <TableRow key={cost.alias}>
                    <TableCell>
                      {getPropertyName(cost.property_alias)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(cost.mortgage_interest)}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {toAmount(cost.other_finance_costs)}
                    </TableCell>
                    <TableCell>{cost.lender_reference}</TableCell>
                    <TableCell>{cost.evidence}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
          <InfoNote>
            Residential finance costs can receive different tax treatment from
            ordinary expenses. Do not automatically deduct them from rental
            profit in the portfolio summary.
          </InfoNote>
        </SectionCard>
      </div>

      <div className='space-y-4'>
        <QuickActions actions={quickActions} />
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
