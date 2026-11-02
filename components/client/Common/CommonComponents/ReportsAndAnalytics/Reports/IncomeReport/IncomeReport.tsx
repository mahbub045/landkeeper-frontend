import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDownloadIncomeReportsMutation } from '@/store/api/endpoints/client/Common/ReportsAndAnalytics/ReportsApi';
import { ReportDateRangeParams } from '@/types/client/Common/ReportsAndAnalytics/ReportsType';
import { Download, LineChart } from 'lucide-react';
import { useState } from 'react';

const IncomeReport: React.FC = () => {
  const [downloadIncomeReports, { isLoading }] =
    useDownloadIncomeReportsMutation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isRangeValid = !!startDate && !!endDate && startDate <= endDate;

  const handleExport = async () => {
    const params: ReportDateRangeParams = {
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await downloadIncomeReports(params).unwrap();

      const blob = response instanceof Blob ? response : new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `income-report_${startDate}_${endDate}.${
        blob.type.includes('pdf') ? 'pdf' : 'xlsx'
      }`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export income report:', error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          className='h-auto w-full p-0 hover:bg-transparent'
          disabled={isLoading}
        >
          <Card className='border-border w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
            <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
              {isLoading ? (
                <Loading />
              ) : (
                <LineChart className='text-emerald-500' />
              )}
              <div>
                <p className='text-foreground text-base font-bold'>
                  Income Report
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Rental income analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='center' className='w-80 space-y-4'>
        <div className='grid grid-cols-2 gap-3'>
          <Field>
            <FieldLabel htmlFor='income-start-date'>Start date</FieldLabel>
            <Input
              id='income-start-date'
              type='date'
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='income-end-date'>End date</FieldLabel>
            <Input
              id='income-end-date'
              type='date'
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
        </div>

        <Button
          type='button'
          className='w-full'
          onClick={handleExport}
          disabled={!isRangeValid || isLoading}
        >
          <Download />
          Download
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default IncomeReport;
