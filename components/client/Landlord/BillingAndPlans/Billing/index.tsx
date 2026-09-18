'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveTab } from '@/store/slices/billingTabSlice';
import { CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';
import BillingHistoryTab from './BillingHistoryTab/BillingHistoryTab';
import OverviewTab from './OverviewTab/OverviewTab';
import PaymentMethodsTab from './PaymentMethodsTab/PaymentMethodsTab';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'payment-methods', label: 'Payment Methods' },
  { key: 'billing-history', label: 'Billing History' },
] as const;

type BillingTab = (typeof TABS)[number]['key'];

const BillingContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(
    (state: RootState) => state.billingTabs.activeTab,
  );

  return (
    <div>
      {/* Breadcrumb */}
      <nav className='text-muted-foreground mb-5 flex items-center gap-1.5 text-sm'>
        <Link href='/client/landlord' className='hover:text-foreground'>
          Home
        </Link>
        <span>/</span>
        <span className='text-foreground font-medium'>Billing</span>
      </nav>

      {/* Header */}
      <div className='mb-6 flex items-start justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl'>
            <CreditCard className='size-5' aria-hidden='true' />
          </div>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Billing</h1>
            <p className='text-muted-foreground mt-0.5 text-sm'>
              Subscription status, plan details and usage limits
            </p>
          </div>
        </div>

        <Button asChild variant='outline' className='shrink-0'>
          <Link href='/client/landlord/billing-and-plans/pricing-plans'>
            <Sparkles className='text-success size-4' />
            Pricing plans
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => dispatch(setActiveTab(value as BillingTab))}
      >
        <TabsList
          variant='line'
          className='mb-6 h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-1'
        >
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className='cursor-pointer'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value='overview'>
          <OverviewTab />
        </TabsContent>
        <TabsContent value='payment-methods'>
          <PaymentMethodsTab />
        </TabsContent>
        <TabsContent value='billing-history'>
          <BillingHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingContainer;
