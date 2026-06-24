import { Tab } from '@/types/client/Common/Properties/PropertyTypes';

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
