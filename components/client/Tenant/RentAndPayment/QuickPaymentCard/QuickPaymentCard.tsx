'use client';

import { Loader2, ShieldCheck, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PROVIDER_ICON } from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { QuickPaymentCardProps } from '@/types/client/Tenant/RentAndPayments/RentAndPaymentsType';

export const QuickPaymentCard: React.FC<QuickPaymentCardProps> = ({
  paymentMethods,
  onSelectPaymentMethod,
  loadingMethodId = null,
}) => {
  return (
    <Card className='from-primary/5 flex h-full flex-col overflow-hidden bg-linear-to-b to-transparent'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <span className='bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
            <Wallet className='text-primary h-4.5 w-4.5' />
          </span>
          Quick Pay & Autopay Setup
        </CardTitle>
        <CardDescription>
          Avoid late fees by automating your rent payments or making a quick
          card payment below.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-3'>
        {paymentMethods.map((method) => {
          const Icon = PROVIDER_ICON[method.provider];
          const isLoading = loadingMethodId === method.id;
          return (
            <div
              key={method.id}
              className='group border-border/60 hover:border-primary/50 hover:bg-card hover:shadow-primary/5 relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-white/60 p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='flex items-start gap-3'>
                <span className='bg-secondary/10 ring-secondary/15 group-hover:bg-secondary/15 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 transition-colors'>
                  <Icon className='text-secondary h-5 w-5' />
                </span>
                <div>
                  <p className='font-heading font-medium'>{method.title}</p>
                  <p className='text-muted-foreground text-sm'>
                    {method.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onSelectPaymentMethod(method)}
                disabled={isLoading}
                className='w-full shrink-0 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-fit'
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Icon className='h-4 w-4' />
                )}
                {isLoading ? 'Redirecting…' : method.ctaLabel}
              </Button>
            </div>
          );
        })}
        <p className='text-muted-foreground mt-auto flex items-center gap-1.5 pt-1 text-xs'>
          <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
          Payments are securely processed and encrypted.
        </p>
      </CardContent>
    </Card>
  );
};
