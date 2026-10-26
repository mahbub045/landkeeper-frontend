'use client';

import { CalendarDays, CircleCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MtdSubmissionStatus } from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';
import {
  MTD_QUARTERS,
  MTD_TAX_YEARS,
} from '@/data/client/Common/MakingTaxDigital/MakingTaxDigitalData';
import { IconBadge } from './MtdShared';

const STATUS_LABEL: Record<MtdSubmissionStatus, string> = {
  DRAFT: 'Draft',
  READY: 'Ready to submit',
  SUBMITTED: 'Submitted',
};

interface ReportingPeriodProps {
  quarter: string;
  taxYear: string;
  onQuarterChange: (value: string) => void;
  onTaxYearChange: (value: string) => void;
  status: MtdSubmissionStatus;
  lastUpdated: string;
}

const ReportingPeriod: React.FC<ReportingPeriodProps> = ({
  quarter,
  taxYear,
  onQuarterChange,
  onTaxYearChange,
  status,
  lastUpdated,
}) => {
  const updatedLabel = new Date(lastUpdated).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]'>
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

      <Card className='rounded-2xl border-emerald-200 bg-emerald-50/60 shadow-md dark:border-emerald-900/40 dark:bg-emerald-950/20'>
        <CardContent className='space-y-2 px-5 py-4'>
          <div className='flex items-center gap-2'>
            <CircleCheck className='size-5 text-emerald-600 dark:text-emerald-400' />
            <h2 className='text-foreground text-sm font-semibold'>
              Submission status
            </h2>
          </div>
          <Badge className='bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300'>
            {STATUS_LABEL[status]}
          </Badge>
          <p className='text-muted-foreground text-xs'>
            Last updated: {updatedLabel}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingPeriod;
