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
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='text-primary h-5 w-5' />
          Rent Statements & Documents
        </CardTitle>
        <CardDescription>
          Need proof of rent for a visa, loan, or personal records?
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4 sm:grid-cols-2'>
        <div className='flex flex-col justify-between gap-4 rounded-lg border p-4'>
          <p className='text-sm'>Download Statement (Full Year)</p>
          <Button
            variant='outline'
            onClick={handleDownloadFullYear}
            disabled={isDownloadingFullYear}
            className='w-fit'
          >
            {isDownloadingFullYear ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Download className='h-4 w-4' />
            )}
            Download PDF
          </Button>
        </div>

        <div className='flex flex-col justify-between gap-4 rounded-lg border p-4'>
          <p className='text-sm'>Download Statement (Custom Range)</p>
          <Popover open={isCustomRangeOpen} onOpenChange={setIsCustomRangeOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-fit'>
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
