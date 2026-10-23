'use client';

import { BarChart3, Building2, Download, Home, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { MtdPropertyBusiness } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import {
  getPortfolioTotals,
  getPropertyTotals,
  MTD_PROPERTIES,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import {
  HelpfulInfo,
  IconBadge,
  InfoNote,
  RowActions,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

const BUSINESS_OPTIONS: { value: MtdPropertyBusiness; label: string }[] = [
  { value: 'UK', label: 'UK property' },
  { value: 'OVERSEAS', label: 'Overseas property' },
  { value: 'BOTH', label: 'Both' },
];

interface PropertiesTabProps {
  onPending: (label: string) => void;
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({ onPending }) => {
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [business, setBusiness] = useState<MtdPropertyBusiness>('UK');

  const totals = getPortfolioTotals();
  const rows = getPropertyTotals().filter(
    (row) => propertyFilter === 'all' || row.property.alias === propertyFilter,
  );

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
        <SectionCard
          icon={Home}
          title='Properties included in this report'
          description='Manage the properties included in your MTD update for this quarter.'
          action={
            <>
              <Button onClick={() => onPending('Add property')}>
                <Plus /> Add property
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
                      <RowActions
                        onEdit={() => onPending('Edit property')}
                        onDelete={() => onPending('Remove property')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>

          <div className='rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/20'>
            <div className='mb-3 flex items-center gap-2'>
              <BarChart3 className='size-5 text-blue-600 dark:text-blue-400' />
              <p className='text-foreground text-sm font-semibold'>
                Portfolio totals
              </p>
            </div>
            <div className='divide-border grid grid-cols-1 gap-3 sm:grid-cols-3 sm:divide-x'>
              {[
                ['Total rental income', totals.income],
                ['Total allowable expenses', totals.expenses],
                ['Net property profit / (loss)', totals.profit],
              ].map(([label, value]) => (
                <div key={label} className='sm:px-4'>
                  <p className='text-muted-foreground text-xs'>{label}</p>
                  <p className='text-lg font-bold text-emerald-600 tabular-nums dark:text-emerald-400'>
                    {toAmount(value as number)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <InfoNote>
            Add every relevant property for this reporting period. Flag
            properties bought, sold, first let or no longer let.
          </InfoNote>
        </SectionCard>

        <div className='space-y-4'>
          <Card className='border-border rounded-2xl shadow-md'>
            <CardContent className='space-y-4 px-5 py-4'>
              <div className='flex items-center gap-3'>
                <IconBadge icon={Building2} className='size-10' />
                <h2 className='text-foreground text-base font-semibold'>
                  Property business
                </h2>
              </div>
              <RadioGroup
                value={business}
                onValueChange={(v) => setBusiness(v as MtdPropertyBusiness)}
                className='gap-3'
              >
                {BUSINESS_OPTIONS.map((option) => (
                  <div key={option.value} className='flex items-center gap-3'>
                    <RadioGroupItem
                      value={option.value}
                      id={`mtd-business-${option.value}`}
                    />
                    <Label
                      htmlFor={`mtd-business-${option.value}`}
                      className='cursor-pointer font-normal'
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <p className='text-muted-foreground text-xs'>
                Keep UK and overseas property totals separate where required.
              </p>
            </CardContent>
          </Card>

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

      <Card className='border-border rounded-2xl shadow-md'>
        <CardContent className='flex flex-wrap items-center justify-between gap-3 px-5 py-3'>
          <button
            type='button'
            onClick={() => onPending('Download property schedule')}
            className='flex cursor-pointer items-center gap-3 text-sm font-medium text-blue-700 hover:underline dark:text-blue-400'
          >
            <IconBadge icon={Download} className='size-9' />
            Download property schedule
          </button>
          <Button onClick={() => onPending('Save changes')}>
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesTab;
