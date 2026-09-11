'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import BillingHistoryTab from './BillingHistoryTab/BillingHistoryTab';
import OverviewTab from './OverviewTab/OverviewTab';
import PaymentMethodsTab from './PaymentMethodsTab/PaymentMethodsTab';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'payment-methods', label: 'Payment Methods' },
  { key: 'billing-history', label: 'Billing History' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const BillingContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

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
      <div className='border-border mb-6 flex gap-6 border-b'>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type='button'
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative -mb-px pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {isActive && (
                <span className='bg-primary absolute inset-x-0 -bottom-px h-0.5 rounded-full' />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'payment-methods' && <PaymentMethodsTab />}
      {activeTab === 'billing-history' && <BillingHistoryTab />}
    </div>
  );
};

export default BillingContainer;
