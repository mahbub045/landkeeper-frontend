import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpCircle, Home, Landmark, TrendingUp } from 'lucide-react';
import RemortgageCalculatorTab from './CalculatorTabs/RemortgageCalculatorTab';
import RentalYieldCalculatorTab from './CalculatorTabs/RentalYieldCanculatorTab';
import RentIncreaseCalculatorTab from './CalculatorTabs/RentIncreaseCalculatorTab';
import StampDutyCalculatorTab from './CalculatorTabs/StampDutyCalculatorTab';

const Calculators: React.FC = () => {
  return (
    <div className='mx-auto w-full max-w-4xl p-4 sm:p-6'>
      <Tabs defaultValue='remortgage' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 gap-1 sm:grid-cols-4'>
          <TabsTrigger
            value='remortgage'
            className='flex cursor-pointer items-center gap-1.5'
          >
            <Home className='h-4 w-4' />
            <span className='hidden sm:inline'>Remortgage Calculator</span>
          </TabsTrigger>
          <TabsTrigger
            value='stamp-duty'
            className='flex cursor-pointer items-center gap-1.5'
          >
            <Landmark className='h-4 w-4' />
            <span className='hidden sm:inline'>Stamp Duty Calculator</span>
          </TabsTrigger>
          <TabsTrigger
            value='rent-increase'
            className='flex cursor-pointer items-center gap-1.5'
          >
            <ArrowUpCircle className='h-4 w-4' />
            <span className='hidden sm:inline'>Rent Increase Calculator</span>
          </TabsTrigger>
          <TabsTrigger
            value='rental-yield'
            className='flex cursor-pointer items-center gap-1.5'
          >
            <TrendingUp className='h-4 w-4' />
            <span className='hidden sm:inline'>Rental Yield Calculator</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='remortgage' className='mt-6'>
          <RemortgageCalculatorTab />
        </TabsContent>
        <TabsContent value='stamp-duty' className='mt-6'>
          <StampDutyCalculatorTab />
        </TabsContent>
        <TabsContent value='rent-increase' className='mt-6'>
          <RentIncreaseCalculatorTab />
        </TabsContent>
        <TabsContent value='rental-yield' className='mt-6'>
          <RentalYieldCalculatorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculators;
