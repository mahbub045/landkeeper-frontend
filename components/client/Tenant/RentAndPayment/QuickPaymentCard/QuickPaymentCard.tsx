'use client';

import { Loader2, Wallet } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wallet className='text-primary h-5 w-5' />
          Quick Pay & Autopay Setup
        </CardTitle>
        <CardDescription>
          Avoid late fees by automating your rent payments or making a quick
          card payment below.
        </CardDescription>
      </CardHeader>
      {/* <CardContent className='grid gap-4 sm:grid-cols-2'>
        {paymentMethods.map((method) => {
          const Icon = PROVIDER_ICON[method.provider];
          const isLoading = loadingMethodId === method.id;
          return (
            <div
              key={method.id}
              className='flex flex-col justify-between gap-4 rounded-lg border p-4'
            >
              <div className='flex items-start gap-3'>
                <Icon className='text-secondary mt-0.5 h-5 w-5 shrink-0' />
                <div>
                  <p className='font-medium'>{method.title}</p>
                  <p className='text-muted-foreground text-sm'>
                    {method.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onSelectPaymentMethod(method)}
                disabled={isLoading}
                className='w-full sm:w-fit'
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
      </CardContent> */}
      <CardContent className='grid gap-4 sm:grid-cols-1'>
        {paymentMethods
          .filter((method) => method.provider === 'stripe')
          .map((method) => {
            const Icon = PROVIDER_ICON[method.provider];
            const isLoading = loadingMethodId === method.id;
            return (
              <div
                key={method.id}
                className='flex flex-col justify-between gap-4 rounded-lg border p-4'
              >
                <div className='flex items-start gap-3'>
                  <Icon className='text-secondary mt-0.5 h-5 w-5 shrink-0' />
                  <div>
                    <p className='font-medium'>{method.title}</p>
                    <p className='text-muted-foreground text-sm'>
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button
                    onClick={() => onSelectPaymentMethod(method)}
                    disabled={isLoading}
                    className='w-full sm:w-fit'
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Icon className='h-4 w-4' />
                    )}
                    {isLoading ? 'Redirecting…' : method.ctaLabel}
                  </Button>
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
};
