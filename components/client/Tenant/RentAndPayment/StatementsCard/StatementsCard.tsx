'use client';

import { CalendarRange, Download, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface StatementsCardProps {
  onDownloadFullYear: () => void;
  onSelectCustomRange: () => void;
}

export const StatementsCard: React.FC<StatementsCardProps> = ({
  onDownloadFullYear,
  onSelectCustomRange,
}) => {
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
            onClick={onDownloadFullYear}
            className='w-fit'
          >
            <Download className='h-4 w-4' />
            Download PDF
          </Button>
        </div>
        <div className='flex flex-col justify-between gap-4 rounded-lg border p-4'>
          <p className='text-sm'>Download Statement (Custom Range)</p>
          <Button
            variant='outline'
            onClick={onSelectCustomRange}
            className='w-fit'
          >
            <CalendarRange className='h-4 w-4' />
            Select Dates & Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
