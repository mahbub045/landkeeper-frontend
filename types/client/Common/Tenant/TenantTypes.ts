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

export interface TenantForm {
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rentAmount: string;
  deposit: string;
  tenancyStart: string;
  tenancyEnd: string;
  employmentDetails: string;
  guarantorName: string;
  notes: string;
}

export interface AddTenantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  properties?: { id: string; name: string }[];
}
