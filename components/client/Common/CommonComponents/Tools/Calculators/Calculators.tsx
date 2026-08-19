'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type AppDispatch, type RootState } from '@/store';
import {
  setActiveTab,
  type CalculatorTab,
} from '@/store/slices/calculatorTabsSlice';
import { ArrowUpCircle, Home, Landmark, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import RemortgageCalculatorTab from './CalculatorTabs/RemortgageCalculatorTab';
import RentalYieldCalculatorTab from './CalculatorTabs/RentalYieldCanculatorTab';
import RentIncreaseCalculatorTab from './CalculatorTabs/RentIncreaseCalculatorTab';
import StampDutyCalculatorTab from './CalculatorTabs/StampDutyCalculatorTab';

const CALCULATOR_TABS = [
  {
    value: 'remortgage',
    label: 'Remortgage',
    icon: Home,
    Component: RemortgageCalculatorTab,
  },
  {
    value: 'stamp-duty',
    label: 'Stamp Duty',
    icon: Landmark,
    Component: StampDutyCalculatorTab,
  },
  {
    value: 'rent-increase',
    label: 'Rent Increase',
    icon: ArrowUpCircle,
    Component: RentIncreaseCalculatorTab,
  },
  {
    value: 'rental-yield',
    label: 'Rental Yield',
    icon: TrendingUp,
    Component: RentalYieldCalculatorTab,
  },
] as const;

const Calculators: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeTab = useSelector(
    (state: RootState) => state.calculatorTabs.activeTab,
  );

  return (
    <div className='mx-auto w-full'>
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const selectedTab = CALCULATOR_TABS.find(
            (tab) => tab.value === value,
          )?.value;

          if (selectedTab) {
            dispatch(setActiveTab(selectedTab as CalculatorTab));
          }
        }}
        className='w-full'
      >
        <TabsList
          className='bg-primary/5 w-full flex-wrap items-start justify-start gap-1.5'
          style={{ height: 'auto', minHeight: 0, padding: '0.25rem' }}
        >
          {CALCULATOR_TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className='flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-1.5 text-sm whitespace-nowrap'
              style={{ margin: 0, minWidth: 150, padding: '0.5rem 0.75rem' }}
            >
              <Icon className='h-4 w-4 shrink-0' />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CALCULATOR_TABS.map(({ value, Component }) => (
          <TabsContent key={value} value={value} className='mt-6'>
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Calculators;
