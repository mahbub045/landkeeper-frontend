export type PropertyStatus = 'Occupied' | 'Vacant';
export type PropertyType = 'residential' | 'hmo' | 'commercial';
export type FilterTab =
  | 'All'
  | 'Residential'
  | 'HMO'
  | 'Commercial'
  | 'Occupied'
  | 'Vacant';

export type Tab = 'Details' | 'Mortgage' | 'Documents';
export interface Property {
  id: number;
  name: string;
  address: string;
  image: string;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  rentPerMonth: number | null;
}

export interface DetailsForm {
  name: string;
  type: string;
  status: string;
  address: string;
  purchasePrice: string;
  currentValue: string;
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

export interface AddPropertyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
