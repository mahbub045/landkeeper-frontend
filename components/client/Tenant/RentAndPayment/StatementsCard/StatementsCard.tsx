'use client';

import { skipToken } from '@reduxjs/toolkit/query/react';
import { CalendarRange, Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CURRENT_YEAR,
  MONTHS,
  YEARS,
} from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { useGetRentStatementPdfQuery } from '@/store/api/endpoints/client/Tenant/PaymentsApi/PaymentsApi';

export const StatementsCard: React.FC = () => {
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const [shouldFetchFullYear, setShouldFetchFullYear] = useState(false);
  const [customParams, setCustomParams] = useState<{
    filename: string;
    period: 'monthly';
    year: number;
    month: number;
  } | null>(null);

  const { isFetching: isDownloadingFullYear, refetch: refetchFullYear } =
    useGetRentStatementPdfQuery(
      { filename: `rent-statement-${CURRENT_YEAR}.pdf` },
      { skip: !shouldFetchFullYear },
    );

  const { isFetching: isDownloadingCustomRange, refetch: refetchCustomRange } =
    useGetRentStatementPdfQuery(customParams ?? skipToken);

  const handleDownloadFullYear = () => {
    if (shouldFetchFullYear) {
      refetchFullYear();
    } else {
      setShouldFetchFullYear(true);
    }
  };

  const handleDownloadCustomRange = () => {
    const params = {
      filename: `rent-statement-${selectedYear}-${selectedMonth}.pdf`,
      period: 'monthly' as const,
      year: selectedYear,
      month: selectedMonth,
    };

    const isSameParams =
      customParams?.year === params.year &&
      customParams?.month === params.month;

    if (isSameParams) {
      refetchCustomRange();
    } else {
      setCustomParams(params);
    }

    setIsCustomRangeOpen(false);
  };

  return (
    <Card className='flex h-full flex-col shadow-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='text-primary h-5 w-5' />
          Rent Statements & Documents
        </CardTitle>
        <CardDescription>
          Need proof of rent for a visa, loan, or personal records?
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-3'>
        <div className='hover:border-primary/40 hover:bg-muted/40 flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-start gap-3'>
            <span className='bg-secondary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
              <Download className='text-secondary h-4.5 w-4.5' />
            </span>
            <div>
              <p className='font-medium'>Full Year Statement</p>
              <p className='text-muted-foreground text-sm'>
                All payments for {CURRENT_YEAR} in one PDF.
              </p>
            </div>
          </div>
          <Button
            variant='outline'
            onClick={handleDownloadFullYear}
            disabled={isDownloadingFullYear}
            className='w-full shrink-0 sm:w-fit'
          >
            {isDownloadingFullYear ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Download className='h-4 w-4' />
            )}
            Download PDF
          </Button>
        </div>

        <div className='hover:border-primary/40 hover:bg-muted/40 flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-start gap-3'>
            <span className='bg-secondary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
              <CalendarRange className='text-secondary h-4.5 w-4.5' />
            </span>
            <div>
              <p className='font-medium'>Custom Range Statement</p>
              <p className='text-muted-foreground text-sm'>
                Pick a specific month and year to download.
              </p>
            </div>
          </div>
          <Popover open={isCustomRangeOpen} onOpenChange={setIsCustomRangeOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-full shrink-0 sm:w-fit'>
                <CalendarRange className='h-4 w-4' />
                Select Dates & Download
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-64 space-y-3'>
              <Select
                value={String(selectedMonth)}
                onValueChange={(value) => setSelectedMonth(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Month' />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(selectedYear)}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Year' />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleDownloadCustomRange}
                disabled={isDownloadingCustomRange}
                className='w-full'
              >
                {isDownloadingCustomRange ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Download className='h-4 w-4' />
                )}
                Download
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
