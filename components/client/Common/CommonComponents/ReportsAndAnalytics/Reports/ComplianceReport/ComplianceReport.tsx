import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const ComplianceReport: React.FC = () => {
  return (
    <Button
      type='button'
      variant='ghost'
      className='h-auto w-full p-0 hover:bg-transparent'
      disabled
    >
      <Card className='border-border relative w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
        <Badge variant='secondary' className='absolute top-3 right-3'>
          Coming soon
        </Badge>
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
  );
};

export default ComplianceReport;
