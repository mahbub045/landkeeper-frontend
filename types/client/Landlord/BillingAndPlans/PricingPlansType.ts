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
  current_plan: boolean;
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
  client_secret: string;
  mode: 'payment' | 'setup';
}
