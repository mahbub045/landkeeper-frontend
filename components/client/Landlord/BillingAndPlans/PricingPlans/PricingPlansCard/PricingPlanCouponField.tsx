'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PricingPlanCouponFieldProps } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { Check, Tag, X } from 'lucide-react';

export default function PricingPlanCouponField({
  inputValue,
  activeCoupon,
  couponError,
  isCouponApplied,
  isLoading,
  onInputChange,
  onApply,
  onClear,
}: PricingPlanCouponFieldProps) {
  return (
    <div className='mx-auto mb-8 flex w-full max-w-md flex-col gap-2'>
      <label htmlFor='coupon-code' className='text-sm font-medium'>
        Have a coupon code?
      </label>
      <form
        className='flex items-center gap-2'
        onSubmit={(e) => {
          e.preventDefault();
          onApply();
        }}
      >
        <div className='relative flex-1'>
          <Tag
            className={cn(
              'absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors',
              isCouponApplied ? 'text-green-600' : 'text-muted-foreground',
            )}
            aria-hidden='true'
          />
          <Input
            id='coupon-code'
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder='e.g. MDM-123456'
            autoComplete='off'
            disabled={isLoading}
            aria-invalid={Boolean(couponError)}
            className={cn(
              'border-primary focus-visible:outline-primary h-11 rounded-xl pr-11 pl-10! font-medium tracking-wide shadow-xs transition-colors focus-visible:ring-0',
              isCouponApplied &&
                'border-green-500/60 bg-green-500/5 focus-visible:ring-green-500/30',
              couponError &&
                'border-destructive focus-visible:outline-destructive',
            )}
          />
          {(inputValue || activeCoupon) && !isLoading && (
            <button
              type='button'
              onClick={onClear}
              aria-label='Remove coupon'
              className='text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none'
            >
              <X className='size-4' aria-hidden='true' />
            </button>
          )}
        </div>
        <Button
          type='submit'
          className='h-11 rounded-xl px-5'
          disabled={
            isLoading ||
            !inputValue.trim() ||
            inputValue.trim() === activeCoupon
          }
        >
          {isLoading ? (
            <Loading className='text-white!' />
          ) : isCouponApplied ? (
            <Check />
          ) : null}
          {isCouponApplied ? 'Applied' : 'Apply Coupon'}
        </Button>
      </form>
      {couponError && (
        <p className='text-destructive flex items-center gap-1.5 text-xs'>
          <X className='size-3.5' aria-hidden='true' />
          {couponError}
        </p>
      )}
      {isCouponApplied && (
        <p className='flex items-center gap-1.5 text-xs text-green-600'>
          <Check className='size-3.5' aria-hidden='true' />
          Coupon <span className='font-semibold'>{activeCoupon}</span> applied.
          Discounted prices are shown below.
        </p>
      )}
    </div>
  );
}
