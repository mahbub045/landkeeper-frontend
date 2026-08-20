'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGetPortfolioReportsMutation } from '@/store/api/endpoints/client/Common/ReportsAndAnalytics/ReportsApi';
import { Button } from '@base-ui/react';
import {
  Building2,
  Calculator,
  FileText,
  Landmark,
  LineChart,
  ShieldCheck,
} from 'lucide-react';

const ReportList: React.FC = () => {
  const [generatedReports, { isLoading }] = useGetPortfolioReportsMutation();

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      <Button>
        <Card className='border-border cursor-pointer shadow-md transition-all hover:shadow-md'>
          <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
            <Building2 className='text-blue-500' />
            <div>
              <p className='text-foreground text-base font-bold'>
                Portfolio Summary
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Complete overview of all properties
              </p>
            </div>
          </CardContent>
        </Card>
      </Button>
      <Button>
        <Card className='border-border cursor-pointer shadow-md transition-all hover:shadow-md'>
          <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
            <LineChart className='text-emerald-500' />
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
      <Button>
        <Card className='border-border cursor-pointer shadow-md transition-all hover:shadow-md'>
          <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
            <FileText className='text-red-500' />
            <div>
              <p className='text-foreground text-base font-bold'>
                Expense Report
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Detailed breakdown of all expenses
              </p>
            </div>
          </CardContent>
        </Card>
      </Button>
      <Button>
        <Card className='border-border cursor-pointer shadow-md transition-all hover:shadow-md'>
          <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
            <Calculator className='text-amber-500' />
            <div>
              <p className='text-foreground text-base font-bold'>
                Tax Preparation
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                HMRC-ready tax summary
              </p>
            </div>
          </CardContent>
        </Card>
      </Button>
      <Button>
        <Card className='border-border cursor-pointer shadow-md transition-all hover:shadow-md'>
          <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
            <ShieldCheck className='text-cyan-500' />
            <div>
              <p className='text-foreground text-base font-bold'>
                Compliance Report
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Certificate status overview
              </p>
            </div>
          </CardContent>
        </Card>
      </Button>
      <Button>
        <Card className='border-border cursor-pointer shadow-md transition-all hover:shadow-md'>
          <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
            <Landmark className='text-purple-500' />
            <div>
              <p className='text-foreground text-base font-bold'>
                Mortgage Summary
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                All mortgage details
              </p>
            </div>
          </CardContent>
        </Card>
      </Button>
    </div>
  );
};

export default ReportList;
