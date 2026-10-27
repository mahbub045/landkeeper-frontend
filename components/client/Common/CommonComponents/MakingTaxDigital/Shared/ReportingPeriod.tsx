'use client';

import { CalendarDays } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MTD_QUARTERS,
  MTD_TAX_YEARS,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { IconBadge } from './MtdShared';

interface ReportingPeriodProps {
  quarter: string;
  taxYear: string;
  onQuarterChange: (value: string) => void;
  onTaxYearChange: (value: string) => void;
}

const ReportingPeriod: React.FC<ReportingPeriodProps> = ({
  quarter,
  taxYear,
  onQuarterChange,
  onTaxYearChange,
}) => {
  return (
    <div>
      <Card className='border-border rounded-2xl shadow-md'>
        <CardContent className='flex flex-col gap-4 px-5 py-4 md:flex-row md:items-start'>
          <div className='flex items-start gap-3 md:w-64 md:shrink-0'>
            <IconBadge icon={CalendarDays} className='size-10' />
            <div>
              <h2 className='text-foreground text-base font-semibold'>
                Reporting period
              </h2>
              <p className='text-muted-foreground text-xs'>
                Select the quarter and tax year you are reporting for.
              </p>
            </div>
          </div>
          <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='mtd-quarter'>Quarter</Label>
              <Select value={quarter} onValueChange={onQuarterChange}>
                <SelectTrigger id='mtd-quarter'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MTD_QUARTERS.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='mtd-tax-year'>Tax year</Label>
              <Select value={taxYear} onValueChange={onTaxYearChange}>
                <SelectTrigger id='mtd-tax-year'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MTD_TAX_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingPeriod;
