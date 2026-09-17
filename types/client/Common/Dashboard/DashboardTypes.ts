export interface ActivityItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  title: string;
  titleColor: string;
  subtitle: string;
  time: string;
}

export interface AlertItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

export type BadgeVariant = 'up' | 'down' | 'alert';

export interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: {
    label: string;
    variant: BadgeVariant;
  };
}

export interface PropertyTypeItem {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

export interface PropertyTypesResponse {
  total: number;
  data: PropertyTypeItem[];
}

export interface ComplianceTypeItem {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

export interface ComplianceTypesResponse {
  total: number;
  data: ComplianceTypeItem[];
}

export interface DashboardData {
  properties: {
    total: number;
    occupied: number;
    vacant: number;
    under_maintenance: number;
  };
  tenants: {
    total: number;
    active: number;
    inactive: number;
  };
  financial: {
    monthly_rental_income: string;
    mortgage_outstanding: string;
    monthly_mortgage_payment: string;
    current_month_income: string;
    current_month_expense: string;
    current_month_net: string;
  };
  mortgages: {
    total: number;
    total_outstanding: string;
    fixed_rate: number;
    variable_rate: number;
    tracker: number;
    offset: number;
  };
  compliance: {
    total: number;
    expired: number;
    expiring_soon: number;
  };
  documents: {
    total: number;
  };
  subscription: {
    plan: string;
    status: string;
    current_period_end: string;
  };
  support: {
    open: number;
    in_progress: number;
  };
}
