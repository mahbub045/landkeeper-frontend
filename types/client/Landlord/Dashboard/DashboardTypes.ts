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