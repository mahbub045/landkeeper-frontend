export type TenantStatus = 'Active' | 'Renewal Due';

export interface Tenant {
  id: number;
  name: string;
  email: string;
  property: string;
  rent: number;
  startDate: string;
  endDate: string;
  status: TenantStatus;
}


export interface TenantTableProps {
  tenants: Tenant[];
  search: string;
  onSearchChange: (value: string) => void;
}