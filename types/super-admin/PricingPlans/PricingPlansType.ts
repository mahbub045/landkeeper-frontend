import { PricingPlan } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { LucideIcon } from 'lucide-react';

export interface PricingPlanCardProps {
  plan: PricingPlan;
}

export interface PricingPlanStyle {
  icon: LucideIcon;
  bar: string;
  iconTile: string;
}
