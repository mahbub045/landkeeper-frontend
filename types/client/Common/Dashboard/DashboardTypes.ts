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

export interface AlertReminderItem {
  alias?: string;
  title: string;
  property: string;
  detail: string;
  days: number;
}

export type AlertsRemindersResponse = AlertReminderItem[];

export type AlertSeverity = 'expired' | 'urgent' | 'upcoming';

export interface AlertSeverityStyle {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  titleColor: string;
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

export interface PropertyPieSlice extends PropertyTypeItem {
  color: string;
  startAngle: number;
  endAngle: number;
  outerRadius: number;
}

export interface PropertyPieCallout {
  slice: PropertyPieSlice;
  side: 'left' | 'right';
  anchorX: number;
  anchorY: number;
  labelY: number;
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

export interface Pie3DSlice extends ComplianceTypeItem {
  color: string;
  startAngle: number;
  endAngle: number;
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

export type IncomeExpenseMonths = 3 | 6 | 12;

export interface IncomeExpenseItem {
  month: string;
  label: string;
  income: string;
  expense: string;
  net: string;
}

export interface IncomeExpenseSummaryItem
  extends Omit<StatCard, 'badge'> {
  valueColor: string;
}

export interface CylinderTheme {
  gradientId: string;
  top: string;
}

export interface CylinderBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  theme: CylinderTheme;
}

export interface CylinderPinLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: number | string;
  color: string;
}

export interface IncomeExpenseResponse {
  months: number;
  total_income: string;
  total_expense: string;
  net: string;
  data: IncomeExpenseItem[];
}
