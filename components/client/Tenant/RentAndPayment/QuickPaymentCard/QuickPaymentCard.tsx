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
    <Card className='flex h-full flex-col'>
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
      <CardContent className='flex flex-1 flex-col gap-3'>
        {paymentMethods.map((method) => {
          const Icon = PROVIDER_ICON[method.provider];
          const isLoading = loadingMethodId === method.id;
          return (
            <div
              key={method.id}
              className='hover:border-primary/40 hover:bg-muted/40 flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='flex items-start gap-3'>
                <span className='bg-secondary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
                  <Icon className='text-secondary h-4.5 w-4.5' />
                </span>
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
                className='w-full shrink-0 sm:w-fit'
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
      </CardContent>
    </Card>
  );
};
