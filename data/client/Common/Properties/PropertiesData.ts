import {
  DetailsForm,
  FilterTab,
  Tab,
} from '@/types/client/Common/Properties/PropertyTypes';
import { PROPERTY_TYPE_OPTIONS } from '@/data/common/ChoiceFieldOptions';

export const TABS: Tab[] = ['Details', 'Property Picture'];
export const TAB_PRIORITY: Tab[] = ['Details', 'Property Picture'];
export const FIELD_TAB_MAP: Record<string, Tab> = {
  name: 'Details',
  type: 'Details',
  status: 'Details',
  address: 'Details',
  property_owner: 'Details',
  ownerships: 'Details',
  company_name: 'Details',
  shareholder: 'Details',
  purchase_price: 'Details',
  current_value: 'Details',
  purchase_date: 'Details',
  monthly_rental_income: 'Details',
  bedrooms: 'Details',
  bathrooms: 'Details',
  year_built: 'Details',
  property_tenure: 'Details',
  remaining_lease_term: 'Details',
  monthly_service_charge: 'Details',
  annual_ground_rent: 'Details',
  council_tax_band: 'Details',
  local_authority: 'Details',
  notes: 'Details',
  documents: 'Property Picture',
  documents_data: 'Property Picture',
};

export const STATUS_STYLES: Record<string, string> = {
  OCCUPIED: 'bg-success/70 text-white',
  VACANT: 'bg-warning/70 text-white',
  UNDER_MAINTENANCE: 'bg-destructive/70 text-white',
};

export const FILTER_TABS: FilterTab[] = [
  'All',
  ...(PROPERTY_TYPE_OPTIONS.map((opt) => opt.label) as FilterTab[]),
];

export const EMPTY_DETAILS_FORM: DetailsForm = {
  property_name: '',
  address: '',
  property_type: 'RESIDENTIAL',
  property_owner: 'OWNER',
  company_name: '',
  shareholder: [],
  status: 'OCCUPIED',
  purchase_price: '',
  current_value: '',
  purchase_date: '',
  year_built: '',
  property_tenure: '',
  remaining_lease_term: '',
  monthly_service_charge: '',
  annual_ground_rent: '',
  council_tax_band: '',
  local_authority: '',
  bedrooms: '',
  bathrooms: '',
  monthly_rental_income: '',
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
