export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface UsageStat {
  label: string;
  value: string;
  percent: number;
}