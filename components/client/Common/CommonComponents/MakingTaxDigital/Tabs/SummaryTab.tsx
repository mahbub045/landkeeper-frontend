'use client';

import { Download, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  getPortfolioTotals,
  getScopeLabel,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { cn } from '@/lib/utils';
import {
  MtdDeclarationCheck,
  MtdDeclarationForm,
  MtdTabProps,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import { getTodayInputDate } from '@/utils/formatters';
import {
  HelpfulInfo,
  IconBadge,
  SectionCard,
  TableFrame,
  toAmount,
} from '../Shared/MtdShared';

const DECLARATION_CHECKS: { key: MtdDeclarationCheck; label: string }[] = [
  {
    key: 'propertiesIncluded',
    label: 'I have included all relevant properties for this reporting period.',
  },
  {
    key: 'entriesChecked',
    label:
      'I have checked the income and expense entries and identified estimates or missing evidence.',
  },
  {
    key: 'itemsFlagged',
    label:
      'I have flagged unusual items, capital improvements, private costs and finance costs for review.',
  },
];

const EMPTY_DECLARATION: MtdDeclarationForm = {
  propertiesIncluded: false,
  entriesChecked: false,
  itemsFlagged: false,
  signatory: '',
  date: '',
  notes: '',
};

const SummaryTab: React.FC<MtdTabProps> = ({ data, properties, onPending }) => {
  const [declaration, setDeclaration] =
    useState<MtdDeclarationForm>(EMPTY_DECLARATION);
  const setField = <K extends keyof MtdDeclarationForm>(
    key: K,
    value: MtdDeclarationForm[K],
  ) => setDeclaration((prev) => ({ ...prev, [key]: value }));
  const isDeclarationComplete =
    DECLARATION_CHECKS.every((check) => declaration[check.key]) &&
    [declaration.signatory, declaration.date, declaration.notes].every(
      (value) => value.trim() !== '',
    );

  const totals = getPortfolioTotals(data, properties.length);
  const scope = getScopeLabel(properties);
  // Other property income (parking, utilities recharged, etc.) is not yet
  // tracked separately from rent
  const otherIncome = 0;

  const rows = [
    {
      category: 'Total rental income',
      amount: toAmount(totals.income),
      notes: `From ${scope}`,
    },
    {
      category: 'Total other property income',
      amount: toAmount(otherIncome),
      notes: 'Includes parking, utilities etc.',
    },
    {
      category: 'TOTAL PROPERTY INCOME',
      amount: toAmount(totals.income + otherIncome),
      notes: 'Sum of rental and other income',
      emphasis: true,
    },
    {
      category: 'Total allowable property expenses',
      amount: toAmount(totals.expenses),
      notes: 'Excludes finance costs',
    },
    {
      category:
        'NET PROPERTY PROFIT / (LOSS) before finance-cost tax treatment',
      amount: toAmount(totals.profit),
      notes: 'Income minus allowable expenses',
      emphasis: true,
    },
    {
      category: 'Total residential finance costs (separately recorded)',
      amount: toAmount(totals.financeCosts),
      notes: 'Mortgage and other finance costs',
    },
    {
      category: 'Number of properties included',
      amount: String(totals.propertyCount),
      notes: 'Properties in this report',
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]'>
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
                {rows.map((row) => (
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
                    <TableCell className='tabular-nums'>{row.amount}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {row.notes}
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
              'Make sure all income and expenses are included for the correct tax quarter.',
              'Check that finance costs are recorded separately and not deducted from rental profit.',
              'Keep UK and overseas property business figures separate where required.',
              'Review your summary before submitting to HMRC.',
            ]}
          />
        </div>
      </div>

      <Card className='border-border rounded-2xl shadow-md'>
        <CardContent className='space-y-4 px-5 py-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <IconBadge icon={Download} className='size-9' />
              <div>
                <p className='text-foreground text-sm font-semibold'>
                  Download annual summary
                </p>
                <p className='text-muted-foreground text-xs'>
                  Complete the declaration below to download your annual
                  figures.
                </p>
              </div>
            </div>
            <Button
              disabled={!isDeclarationComplete}
              onClick={() => onPending('Download summary')}
            >
              <Download /> Download summary
            </Button>
          </div>

          <div className='space-y-3'>
            {DECLARATION_CHECKS.map((check) => (
              <div key={check.key} className='flex items-start gap-3'>
                <Checkbox
                  id={`mtd-declaration-${check.key}`}
                  checked={declaration[check.key]}
                  onCheckedChange={(checked) =>
                    setField(check.key, checked === true)
                  }
                  className='border-primary mt-0.5 cursor-pointer'
                />
                <Label
                  htmlFor={`mtd-declaration-${check.key}`}
                  className='cursor-pointer leading-snug font-normal'
                >
                  {check.label}
                </Label>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='mtd-declaration-signatory'>
                Landlord / authorised person
              </FieldLabel>
              <Input
                type='text'
                id='mtd-declaration-signatory'
                value={declaration.signatory}
                onChange={(e) => setField('signatory', e.target.value)}
                placeholder='Full name'
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='mtd-declaration-date'>Date</FieldLabel>
              <Input
                id='mtd-declaration-date'
                type='date'
                value={declaration.date}
                max={getTodayInputDate()}
                onChange={(e) => setField('date', e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='mtd-declaration-notes'>Notes</FieldLabel>
            <Textarea
              id='mtd-declaration-notes'
              value={declaration.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder='Add any notes for your accountant or records'
              rows={3}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
