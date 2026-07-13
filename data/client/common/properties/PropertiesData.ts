import {
  DetailsForm,
  FilterTab,
  Tab,
} from '@/types/client/Common/Properties/PropertyTypes';

export const TABS: Tab[] = ['Details', 'Property Picture'];
export const TAB_PRIORITY: Tab[] = ['Details', 'Property Picture'];
export const FIELD_TAB_MAP: Record<string, Tab> = {
  name: 'Details',
  type: 'Details',
  status: 'Details',
  address: 'Details',
  purchasePrice: 'Details',
  currentValue: 'Details',
  purchaseDate: 'Details',
  rentPerMonth: 'Details',
  bedrooms: 'Details',
  bathrooms: 'Details',
  notes: 'Details',
  documents: 'Property Picture',
};

export const filterTabs: FilterTab[] = [
  'All',
  'Residential',
  'HMO',
  'Commercial',
  'Mixed Use',
  'Holiday Let',
  'Occupied',
  'Vacant',
  'Under Maintenance',
];

export const propertyTypeMap: Partial<Record<FilterTab, string>> = {
  Residential: 'RESIDENTIAL',
  HMO: 'HMO',
  Commercial: 'COMMERCIAL',
  'Mixed Use': 'MIXED_USE',
  'Holiday Let': 'HOLIDAY_LET',
};

export const PROPERTY_STATUS_OPTIONS = [
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'VACANT', label: 'Vacant' },
  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
];

export const STATUS_STYLES: Record<string, string> = {
  OCCUPIED: 'bg-success/70 text-white',
  VACANT: 'bg-warning/70 text-white',
  UNDER_MAINTENANCE: 'bg-destructive/70 text-white',
};

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'HMO', label: 'HMO' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'MIXED_USE', label: 'Mixed Use' },
  { value: 'HOLIDAY_LET', label: 'Holiday Let' },
];

export const EMPTY_DETAILS_FORM: DetailsForm = {
  name: '',
  type: 'RESIDENTIAL',
  status: 'OCCUPIED',
  address: '',
  purchasePrice: '',
  currentValue: '',
  rentPerMonth: '',
  purchaseDate: '',
  bedrooms: '',
  bathrooms: '',
  notes: '',
};

export const OVERRIDE_KEY_MAP: Record<string, string> = {
  property_name: 'name',
  property_type: 'type',
};

export const TAB_LABELS: Record<string, string> = {
  Details: 'Details',
  'Property Picture': 'Property Picture',
};
