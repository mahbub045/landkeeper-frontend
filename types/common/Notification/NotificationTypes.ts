export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  is_read: boolean;
  created_at?: string;
  data?: {
    type: string;
    alias: string;
    is_deleted?: boolean;
  };
}
