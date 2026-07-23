export type PropertyStatus = 'Occupied' | 'Vacant';
export type PropertyType = 'residential' | 'hmo' | 'commercial';
export type FilterTab =
  | 'All'
  | 'Residential'
  | 'HMO'
  | 'Commercial'
  | 'Mixed Use'
  | 'Holiday Let'
  | 'Occupied'
  | 'Vacant'
  | 'Under Maintenance';

export type Tab = 'Details' | 'Mortgage' | 'Property Picture';
export interface PropertyDocument {
  id: number;
  image: string;
  description: string | null;
}

export interface Property {
  id: number;
  alias: string;
  property_name: string;
  address: string;

  property_owner: string;
  shareholder: [
    {
      owner_name?: string;
      shareholder_name?: string;
      share_percentage?: string;
    },
  ];
  property_type: string;
  status: string;
  purchase_price: string | null;
  current_value: string | null;
  purchase_date: string | null;
  year_built: string | null;
  property_tenure: string | null;
  remaining_lease_term: string | null;
  monthly_service_charge: string | null;
  annual_ground_rent: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  council_tax_band: string | null;
  local_authority: string | null;
  monthly_rental_income: string | null;
  notes: string;
  documents: PropertyDocument[];
  created_at: string;
  updated_at: string;
}

export interface DetailsForm {
  property_name: string;
  address: string;
  property_owner: string;
  shareholder: {
    owner_name?: string;
    shareholder_name?: string;
    share_percentage?: string;
  }[];
  property_type: string;
  status: string;
  purchase_price: string;
  current_value: string;
  purchase_date: string;
  year_built: string;
  property_tenure: string;
  remaining_lease_term: string;
  monthly_service_charge: string;
  annual_ground_rent: string;
  council_tax_band: string;
  local_authority: string;
  bedrooms: string;
  bathrooms: string;
  monthly_rental_income: string;
  notes: string;
}

export interface PropertyFilterProps {
  filterTabs: FilterTab[];
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}

export interface PropertyCardProps {
  property: Property;
}

export interface PropertyGridProps {
  properties: Property[];
  activeFilter: FilterTab;
  isLoading?: boolean;
}

export interface AddPropertyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UpdatePropertyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  property: Property | null;
}

export interface DeletePropertyDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  propertyAlias: string;
  propertyName: string;
}
