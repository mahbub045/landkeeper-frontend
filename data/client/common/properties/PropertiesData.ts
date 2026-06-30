import { FilterTab, Tab } from '@/types/client/Common/Properties/PropertyTypes';

export const TABS: Tab[] = ['Details', 'Documents'];
export const TAB_PRIORITY: Tab[] = ['Details', 'Documents'];
export const FIELD_TAB_MAP: Record<string, Tab> = {
  name: 'Details',
  type: 'Details',
  status: 'Details',
  address: 'Details',
  purchasePrice: 'Details',
  currentValue: 'Details',
  purchaseDate: 'Details',
  rent_per_month: 'Details',
  bedrooms: 'Details',
  bathrooms: 'Details',
  notes: 'Details',
  documents: 'Documents',
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

export const statusMap: Partial<Record<FilterTab, string>> = {
  Occupied: 'OCCUPIED',
  Vacant: 'VACANT',
  'Under Maintenance': 'UNDER_MAINTENANCE',
};
