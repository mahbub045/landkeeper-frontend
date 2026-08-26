import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

const TaxPreparationReport: React.FC = () => {
  return (
    <Button
      type='button'
      variant='ghost'
      className='h-auto w-full p-0 hover:bg-transparent'
    >
      <Card className='border-border w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
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
  );
};

export default TaxPreparationReport;
