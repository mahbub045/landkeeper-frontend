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

export type Tab = 'Details' | 'Mortgage' | 'Documents';
export interface PropertyDocument {
  id: number;
  image: string;
  description: string | null;
}

export interface Property {
  alias: string;
  property_name: string;
  property_type: string;
  status: string;
  address: string;
  purchase_price: string | null;
  current_value: string | null;
  purchase_date: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  rent_per_month: string | null;
  notes: string;
  documents: PropertyDocument[];
  created_at: string;
  updated_at: string;
}

export interface DetailsForm {
  name: string;
  type: string;
  status: string;
  address: string;
  purchasePrice: string;
  currentValue: string;
  rent_per_month: string;
  purchaseDate: string;
  bedrooms: string;
  bathrooms: string;
  notes: string;
}

export interface MortgageForm {
  lenderName: string;
  productType: string;
  interestRate: string;
  monthlyPayment: string;
  outstandingBalance: string;
  startDate: string;
  endDate: string;
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
