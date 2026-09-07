export type PricingPlanFeature = {
  code: string;
  name: string;
  description: string;
};

export type PricingPlan = {
  alias: string;
  name: string;
  plan_type: 'BASIC' | 'STANDARD' | 'PREMIUM' | string;
  monthly_price: string;
  max_properties: number;
  referral_discount_percent: string;
  features: PricingPlanFeature[];
};

export type PricingPlansResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PricingPlan[];
};

export type SelectPricingPlanRequest = {
  plan: string;
  payment_method_id: string;
};

export type SelectPricingPlanResponse = {
  redirect_url: string;
};
