// components/client/Common/Payments/PaymentDialogStepHeader.tsx
'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
}

interface PaymentDialogStepsProps {
  steps: Step[];
  currentIndex: number;
}

export const PaymentDialogSteps: React.FC<PaymentDialogStepsProps> = ({
  steps,
  currentIndex,
}) => {
  return (
    <div className='flex items-center gap-2 pb-2'>
      {steps.map((step, i) => (
        <div key={step.label} className='flex flex-1 items-center gap-2'>
          <div
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
              i < currentIndex && 'bg-primary text-primary-foreground',
              i === currentIndex && 'bg-primary/15 text-primary ring-primary ring-1',
              i > currentIndex && 'bg-muted text-muted-foreground',
            )}
          >
            {i < currentIndex ? <CheckCircle2 className='h-4 w-4' /> : i + 1}
          </div>
          <span
            className={cn(
              'text-xs font-medium',
              i === currentIndex ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className='bg-border h-px flex-1' />
          )}
        </div>
      ))}
    </div>
  );
};