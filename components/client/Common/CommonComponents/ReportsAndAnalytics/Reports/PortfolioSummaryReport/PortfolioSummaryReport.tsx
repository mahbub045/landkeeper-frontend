import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetPortfolioReportsMutation } from '@/store/api/endpoints/client/Common/ReportsAndAnalytics/ReportsApi';
import { Building2 } from 'lucide-react';

const PortfolioSummaryReport: React.FC = () => {
  const [generatedReports, { isLoading }] = useGetPortfolioReportsMutation();
  return (
    <Button
      type='button'
      variant='ghost'
      className='h-auto w-full p-0 hover:bg-transparent'
    >
      <Card className='border-border w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
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
  );
};

export default PortfolioSummaryReport;
