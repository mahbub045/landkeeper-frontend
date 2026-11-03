export type PricingPlanFeature = {
  code: string;
  name: string;
  description: string;
  is_included: boolean;
  value: string;
};

export type PricingPlan = {
  alias: string;
  name: string;
  plan_type: 'STARTER' | 'BASIC' | 'STANDARD' | 'PREMIUM' | string;
  monthly_price: string;
  max_properties: number;
  max_users: number | null;
  description?: string;
  is_active?: boolean;
  referral_discount_percent?: string;
  features: PricingPlanFeature[];
  current_plan: boolean;
  discounted_price?: string;
  coupon_code?: string;
  discount_value?: string;
  discount_type?: 'percentage' | 'fixed';
};

export type PricingPlansResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PricingPlan[];
};

export type SelectPricingPlanRequest = {
  plan_id: string;
};

export interface SelectPricingPlanResponse {
  redirect_url: string;
  client_secret: string | null;
  mode?: 'payment' | 'setup';
  message?: string;
}

export interface PricingPlansComparisonTableProps {
  plans: PricingPlan[];
  isSelectingPlan: boolean;
  selectedPlanType: string | null;
  onChoosePlan: (plan: PricingPlan) => void;
}

export interface PricingPlanFeatureCellProps {
  feature?: PricingPlanFeature;
}

export interface PricingPlanSectionProps {
  plan: PricingPlan;
}

export type PricingPlanChooseButtonProps = PricingPlanSectionProps &
  Omit<PricingPlansComparisonTableProps, 'plans'>;

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
