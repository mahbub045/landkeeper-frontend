import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Landmark } from 'lucide-react';

const MortgageSummaryReport: React.FC = () => {
  return (
    <Button
      type='button'
      variant='ghost'
      className='h-auto w-full p-0 hover:bg-transparent'
    >
      <Card className='border-border w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
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
  );
};

export default MortgageSummaryReport;
