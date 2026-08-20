import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

const IncomeReport: React.FC = () => {
  return (
    <Button
      type='button'
      variant='ghost'
      className='h-auto w-full p-0 hover:bg-transparent'
    >
      <Card className='border-border w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
        <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
          <LineChart className='text-emerald-500' />
          <div>
            <p className='text-foreground text-base font-bold'>Income Report</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Rental income analysis
            </p>
          </div>
        </CardContent>
      </Card>
    </Button>
  );
};

export default IncomeReport;
