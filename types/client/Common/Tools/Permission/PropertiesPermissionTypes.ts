export interface Property {
  id: number;
  alias: string;
  property_name: string;
  address?: string;
  property_type?: string;
  status?: string;
  documents?: {
    id: number;
    image: string;
  }[];
}

export interface Mortgage {
  lender_name: string;
}

export interface PropertiesPermissionType {
  alias: string;
  can_view: boolean;
  can_edit: boolean;
  property: Property;
  mortgage: Mortgage;
}

export type PropertyForPermissionType = {
  id: number;
  alias: string;
  property_name: string;
  address: string;
  property_owner: string;
  company_name: string;
  property_type: string;
  status: string;
};

export interface GrantedPropertieCardProps {
  item: PropertiesPermissionType;
  isPending: boolean;
  handleToggleCanEdit: (alias: string, checked: boolean) => void;
  handleRevoke: (alias: string) => void;
}

export interface AddablePropertieCardProps {
  item: {
    id: number;
    alias: string;
    property_name: string;
    address: string;
    property_type: string;
    status: string;
    documents?: {
      id: number;
      image: string;
    }[];
  };
  selected: boolean;
  toggleProperty: (alias: string) => void;
}

export interface AddPropertiesTabProps {
  isLoadingAddable: boolean;
  userAlias: string | undefined;
  addableProperties: PropertyForPermissionType[];
  addableCount: number;
  addableTotalPages: number;
  addablePage: number;
  setAddablePage: (page: number | ((prev: number) => number)) => void;
  selectedAliases: string[];
  toggleProperty: (alias: string) => void;
  toggleSelectAll: () => void;
  canEdit: boolean;
  setCanEdit: (value: boolean) => void;
  handleSubmit: () => Promise<void>;
  isSaving: boolean;
  allSelected: boolean;
}

export interface ManageExistingTabProps {
  isLoadingGranted: boolean;
  userAlias: string | undefined;
  grantedProperties: PropertiesPermissionType[];
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
