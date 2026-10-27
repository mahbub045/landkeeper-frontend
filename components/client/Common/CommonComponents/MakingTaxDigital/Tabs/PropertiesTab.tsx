'use client';

import { Home } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPropertyTotals } from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { MtdPeriodData } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import {
  HelpfulInfo,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

interface PropertiesTabProps {
  data: MtdPeriodData;
  onPending: (label: string) => void;
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({ data, onPending }) => {
  const rows = getPropertyTotals(data);

  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
      <SectionCard
        icon={Home}
        title='Properties included in this report'
        description='Manage the properties included in your MTD update for this quarter.'
      >
        <TableFrame>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Address / country</TableHead>
                <TableHead>Property type</TableHead>
                <TableHead>Ownership share</TableHead>
                <TableHead>Letting status</TableHead>
                <TableHead>Rental income</TableHead>
                <TableHead>Allowable expenses</TableHead>
                <TableHead>Profit / (loss)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.property.alias}>
                  <TableCell className='text-foreground font-medium'>
                    {row.property.name}
                  </TableCell>
                  <TableCell className='max-w-44 whitespace-normal'>
                    {row.property.address}
                  </TableCell>
                  <TableCell>{row.property.property_type}</TableCell>
                  <TableCell>{row.property.ownership_share}%</TableCell>
                  <TableCell>{row.property.letting_status}</TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(row.income)}
                  </TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(row.expenses)}
                  </TableCell>
                  <TableCell className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
                    {toAmount(row.profit)}
                  </TableCell>
                  <TableCell>
                    <RowActions onDelete={() => onPending('Remove property')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableFrame>
      </SectionCard>

      <div>
        <HelpfulInfo
          items={[
            'Confirm ownership shares are accurate.',
            'Include properties bought, sold or first let during the quarter.',
            'Keep overseas property records separate where required.',
            'Check letting status and property details before submitting.',
          ]}
        />
      </div>
    </div>
  );
};

export default PropertiesTab;
