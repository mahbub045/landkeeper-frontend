export interface Report {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
}

export interface ReportDateRangeParams {
  start_date: string;
  end_date: string;
}
