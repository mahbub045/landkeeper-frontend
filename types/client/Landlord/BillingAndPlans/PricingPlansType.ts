export type SelectPricingPlanRequest = {
  plan_id: string;
};

export interface SelectPricingPlanResponse {
  redirect_url: string;
  client_secret: string | null;
  mode?: 'payment' | 'setup';
  message?: string;
}

export interface PricingPlanCouponFieldProps {
  inputValue: string;
  activeCoupon: string;
  couponError: string;
  isCouponApplied: boolean;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}
