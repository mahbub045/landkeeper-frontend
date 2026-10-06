export interface TenantTypes {
  alias: string;
  avatar: string | null;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  image: string | null;
  rent_amount: number | null;
  deposit: number | null;
  tenancy_start_date: string | null;
  tenancy_end_date: string | null;
  employment_details: string;
  guarantor_name: string;
  notes: string;
  is_active: boolean;
  is_password_set: boolean;
  property: Property;
  created_at: string;
}

interface Property {
  id: number;
  alias: string;
  property_name: string;
}

export interface TenantListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TenantTypes[];
}

export interface TenantTableProps {
  tenants: TenantTypes[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

export interface TenantRowProps {
  tenant: TenantTypes;
  idx: number;
}

export interface TenantForm {
  propertyId: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  rent_amount: string;
  deposit: string;
  tenancy_start_date: string;
  tenancy_end_date: string;
  employment_details: string;
  guarantor_name: string;
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
  tenant: TenantTypes | null;
}

export interface SendInvitationDialogProps {
  open: boolean;
  onClose: () => void;
  tenantData: TenantTypes | null;
}

export interface UpdateTenantFormProps {
  tenant: TenantTypes;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UpdateTenantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenant: TenantTypes | null;
}

export interface DeleteTenantDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tenantData: TenantTypes | null;
}
