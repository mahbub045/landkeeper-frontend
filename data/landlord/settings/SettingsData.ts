import { NotificationSetting, UsageStat } from '@/types/landlord/Settings/SettingsTypes';


export const defaultNotifications: NotificationSetting[] = [
  { id: 'email',  title: 'Email Alerts',           description: 'Receive compliance and renewal reminders',  enabled: true  },
  { id: 'sms',    title: 'SMS Notifications',      description: 'Get urgent alerts via text message',        enabled: false },
  { id: 'weekly', title: 'Weekly Summary',         description: 'Portfolio performance email every Monday',  enabled: true  },
  { id: 'docs',   title: 'Document Upload Alerts', description: 'Notify when team members upload documents', enabled: true  },
];

export const usageStats: UsageStat[] = [
  { label: 'Properties',   value: '5 / Unlimited', percent: 12 },
  { label: 'Storage',      value: '1.2 GB / 10 GB', percent: 12 },
  { label: 'Team Members', value: '3 / 10',          percent: 30 },
];