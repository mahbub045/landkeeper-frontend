export type TenantStatus = 'Active' | 'Renewal Due';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  property: string;
  rent: number;
  startDate: string;
  endDate: string;
  status: TenantStatus;
}

export interface ApiTenant {
  alias: string;
  avatar: string | null;
  deposit: string;
  email: string;
  employment_details: string;
  first_name: string;
  guarantor_name: string;
  last_name: string;
  notes: string;
  phone: string;
  property: {
    alias: string;
    id: number;
    property_name: string;
  } | null;
  rent_amount: string;
  tenancy_end_date: string;
  tenancy_start_date: string;
}

export interface TenantListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiTenant[];
}

export interface TenantTableProps {
  tenants: Tenant[];
  search: string;
  apiTenants: ApiTenant[];
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

export interface TenantRowProps {
  tenant: Tenant;
  apiTenant: ApiTenant;
  idx: number;
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

export interface ViewTenantDialogProps {
  open: boolean;
  onClose: () => void;
  tenant: ApiTenant | null;
}

export interface UpdateTenantFormProps {
  tenant: ApiTenant;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UpdateTenantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenant: ApiTenant | null;
}

export interface DeleteTenantDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenantAlias: string;
  tenantName: string;
}
