'use client';

import { Home } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { MtdPropertiesTableProps } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { SectionCard, TableFrame, toAmount } from './MtdShared';

const MtdPropertiesTable: React.FC<MtdPropertiesTableProps> = ({
  rows,
  selected,
  onSelectedChange,
}) => {
  const allSelected = selected.length === rows.length;
  const selectedRows = rows.filter((row) =>
    selected.includes(row.property.alias),
  );
  const sumOf = (key: 'income' | 'expenses' | 'profit') =>
    selectedRows.reduce((total, row) => total + row[key], 0);

  const toggle = (alias: string) =>
    onSelectedChange(
      selected.includes(alias)
        ? selected.filter((a) => a !== alias)
        : [...selected, alias],
    );
  const toggleAll = () =>
    onSelectedChange(allSelected ? [] : rows.map((row) => row.property.alias));

  return (
    <SectionCard
      icon={Home}
      title='Properties included in this report'
      description='Tick the properties to include. Every tab below uses this selection.'
      action={
        <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'>
          {selected.length} of {rows.length} selected
        </span>
      }
    >
      <TableFrame>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox
                  aria-label='Select all properties'
                  checked={
                    allSelected
                      ? true
                      : selected.length > 0
                        ? 'indeterminate'
                        : false
                  }
                  onCheckedChange={toggleAll}
                  className='border-primary cursor-pointer'
                />
              </TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Address / country</TableHead>
              <TableHead>Property type</TableHead>
              <TableHead>Ownership share</TableHead>
              <TableHead>Letting status</TableHead>
              <TableHead>Rental income</TableHead>
              <TableHead>Allowable expenses</TableHead>
              <TableHead>Profit / (loss)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected.includes(row.property.alias);
              return (
                <TableRow
                  key={row.property.alias}
                  data-state={isSelected ? 'selected' : undefined}
                  onClick={() => toggle(row.property.alias)}
                  className={cn(
                    'cursor-pointer',
                    isSelected
                      ? 'bg-blue-50/40 dark:bg-blue-950/15'
                      : 'text-muted-foreground opacity-70',
                  )}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      aria-label={`Include ${row.property.name}`}
                      checked={isSelected}
                      onCheckedChange={() => toggle(row.property.alias)}
                      className='border-primary cursor-pointer'
                    />
                  </TableCell>
                  <TableCell className='text-foreground font-medium'>
                    {row.property.name}
                  </TableCell>
                  <TableCell className='max-w-44 whitespace-normal'>
                    {row.property.address}
                  </TableCell>
                  <TableCell>{row.property.property_type}</TableCell>
                  <TableCell>{row.property.ownership_share}%</TableCell>
                  <TableCell>
                    <span className='inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'>
                      {row.property.letting_status}
                    </span>
                  </TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(row.income)}
                  </TableCell>
                  <TableCell className='tabular-nums'>
                    {toAmount(row.expenses)}
                  </TableCell>
                  <TableCell className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
                    {toAmount(row.profit)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter className='bg-blue-50/60 dark:bg-blue-950/20'>
            <TableRow>
              <TableCell />
              <TableCell colSpan={5} className='text-foreground font-semibold'>
                Total for selected properties
              </TableCell>
              <TableCell className='font-semibold tabular-nums'>
                {toAmount(sumOf('income'))}
              </TableCell>
              <TableCell className='font-semibold tabular-nums'>
                {toAmount(sumOf('expenses'))}
              </TableCell>
              <TableCell className='font-bold text-emerald-600 tabular-nums dark:text-emerald-400'>
                {toAmount(sumOf('profit'))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableFrame>
    </SectionCard>
  );
};

export default MtdPropertiesTable;
