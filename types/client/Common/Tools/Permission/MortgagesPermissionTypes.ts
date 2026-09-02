export interface MortgageProperty {
  address?: string;
}

export interface Mortgage {
  id: number;
  alias: string;
  lender_name: string;
  interest_rate_type?: string;
  interest_rate?: number | null;
  interest_rate_expiry_date?: string | null;
  outstanding_balance?: number | null;
  monthly_payment?: number | null;
  remaining_mortgage?: number | null;
}

export interface MortgagesPermissionType {
  alias: string;
  can_view: boolean;
  can_edit: boolean;
  property: MortgageProperty;
  mortgage: Mortgage;
}

export type MortgageForPermissionType = {
  alias: string;
  lender_name: string;
  interest_rate_type: string;
  interest_rate: number | null;
  interest_rate_expiry_date: string | null;
  outstanding_balance: number | null;
  monthly_payment: number | null;
  remaining_mortgage: number | null;
  property: MortgageProperty;
  epc_rating?: string | null;
};

export interface GrantedMortgageCardProps {
  item: MortgagesPermissionType;
  isPending: boolean;
  handleToggleCanEdit: (alias: string, checked: boolean) => void;
  handleRevoke: (alias: string) => void;
}

export interface AddableMortgageCardProps {
  item: MortgageForPermissionType;
  selected: boolean;
  toggleMortgage: (alias: string) => void;
}

export interface AddMortgagesTabProps {
  isLoadingAddable: boolean;
  userAlias: string | undefined;
  addableMortgages: MortgageForPermissionType[];
  addableCount: number;
  addableTotalPages: number;
  addablePage: number;
  setAddablePage: (page: number | ((prev: number) => number)) => void;
  selectedAliases: string[];
  toggleMortgage: (alias: string) => void;
  toggleSelectAll: () => void;
  canEdit: boolean;
  setCanEdit: (value: boolean) => void;
  handleSubmit: () => Promise<void>;
  isSaving: boolean;
  allSelected: boolean;
}

export interface ManageExistingMortgageTabProps {
  isLoadingGranted: boolean;
  userAlias: string | undefined;
  grantedMortgages: MortgagesPermissionType[];
  grantedCount: number;
  grantedTotalPages: number;
  grantedPage: number;
  setGrantedPage: (page: number | ((prev: number) => number)) => void;
  pendingAliases: Set<string>;
  handleToggleCanEdit: (
    permissionAlias: string,
    nextCanEdit: boolean,
  ) => Promise<void>;
  handleRevoke: (permissionAlias: string) => Promise<void>;
}
