// Single source of truth for every select / radio option that mirrors a
// backend choice field. Feature data files derive their lookups from these.
import { TransactionCategoryOption } from '@/types/client/Common/Finance/FinanceTypes';
import {
  MaintenanceCategory,
  MaintenanceStatus,
} from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';

// ---------- Users ----------

export const TITLE_OPTIONS = [
  { value: 'MR', label: 'Mr' },
  { value: 'MRS', label: 'Mrs' },
  { value: 'MS', label: 'Ms' },
  { value: 'MISS', label: 'Miss' },
  { value: 'DR', label: 'Dr' },
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'DOCTOR', label: 'Doctor' },
];

export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'LETTING_AGENT', label: 'Letting Agent' },
  { value: 'MORTGAGE_ADVISER', label: 'Mortgage Adviser' },
];

// ---------- Properties ----------

export const PROPERTY_STATUS_OPTIONS = [
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'VACANT', label: 'Vacant' },
  { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' },
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'HOUSE', label: 'House' },
  { value: 'FLAT', label: 'Flat' },
  { value: 'MAISONETTE', label: 'Maisonette' },
  { value: 'BUNGALOW', label: 'Bungalow' },
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'HMO', label: 'HMO' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'HOLIDAY_LET', label: 'Holiday Let' },
];

export const PROPERTY_OWNER_OPTIONS = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'COMPANY', label: 'Company' },
];

export const PROPERTY_TENURE_OPTIONS = [
  { value: 'FREEHOLD', label: 'Freehold' },
  { value: 'LEASEHOLD', label: 'Leasehold' },
];

// ---------- Finance ----------

export const TRANSACTION_CATEGORY_OPTIONS: TransactionCategoryOption[] = [
  { value: 'RENTAL_INCOME', label: 'Rental Income' },
  { value: 'MORTGAGE_PAYMENT', label: 'Mortgage Payment' },
  { value: 'REPAIRS', label: 'Repairs' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'SERVICE_CHARGES', label: 'Service Charges' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'MANAGEMENT_FEES', label: 'Management Fees' },
  { value: 'TAX', label: 'Tax' },
  { value: 'OTHER', label: 'Other' },
];

// ---------- Mortgage ----------

export const INTEREST_RATE_TYPE_OPTIONS = [
  { value: 'FIXED_RATE', label: 'Fixed Rate' },
  { value: 'VARIABLE_RATE', label: 'Variable Rate' },
  { value: 'TRACKER', label: 'Tracker' },
  { value: 'OFFSET', label: 'Offset' },
];

// ---------- Compliance ----------

// Mirrors the backend `CertificateType` choices
export const CERTIFICATE_OPTIONS = [
  { value: 'GAS_SAFETY_CERTIFICATE', label: 'Gas Safety Certificate' },
  {
    value: 'EPC_CERTIFICATE',
    label: 'Energy Performance Certificate (EPC)',
  },
  {
    value: 'EICR_CERTIFICATE',
    label: 'Electrical Installation Condition Report (EICR)',
  },
  {
    value: 'DEPOSIT_PROTECTION_CERTIFICATE',
    label: 'Deposit Protection Certificate',
  },
  { value: 'RIGHT_TO_RENT_CHECK', label: 'Right to Rent Checks' },
  { value: 'HMO_LICENCE', label: 'HMO Licence' },
  {
    value: 'PROPERTY_INSURANCE_CERTIFICATE',
    label: 'Property Insurance Certificate',
  },
  {
    value: 'FIRE_SAFETY_CERTIFICATE',
    label: 'Fire Safety Certificate / Fire Risk Assessment',
  },
  { value: 'SELECTIVE_LICENCE', label: 'Selective Licence' },
  {
    value: 'PAT_TESTING_CERTIFICATE',
    label: 'Portable Appliance Testing (PAT) Certificate',
  },
  { value: 'PROPERTY_FLOOR_PLANS', label: 'Property Floor Plans' },
];

// ---------- Documents ----------

// Both AddDocumentDialog's category <Select> and the list page's filter
// tabs derive from this.
export const DOCUMENT_CATEGORY_OPTIONS = [
  { value: 'MORTGAGE_DOCUMENTS', label: 'Mortgage Documents' },
  { value: 'TENANCY_AGREEMENT', label: 'Tenancy Agreement' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'TAX_DOCUMENT', label: 'Tax Document' },
  { value: 'PROPERTY_PHOTO', label: 'Property Photo' },
  { value: 'LEGAL_DOCUMENT', label: 'Legal Document' },
] as const;

// ---------- Property maintenance ----------

export const MAINTENANCE_STATUS_OPTIONS: Array<{
  value: MaintenanceStatus;
  label: string;
}> = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const MAINTENANCE_CATEGORY_OPTIONS: Array<{
  value: MaintenanceCategory;
  label: string;
}> = [
  { value: 'PLUMBING_WATER', label: 'Plumbing & Water' },
  { value: 'HEATING_HOT_WATER', label: 'Heating & Hot Water' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'GAS', label: 'Gas' },
  { value: 'ROOF_GUTTERING', label: 'Roof & Guttering' },
  { value: 'DAMP_MOULD_CONDENSATION', label: 'Damp, Mould & Condensation' },
  { value: 'DOORS_WINDOWS_LOCKS', label: 'Doors, Windows & Locks' },
  { value: 'BATHROOM', label: 'Bathroom' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'HEATING_VENTILATION', label: 'Heating & Ventilation' },
  { value: 'STRUCTURAL_BUILDING', label: 'Structural & Building' },
  { value: 'PEST_CONTROL', label: 'Pest Control' },
  { value: 'SECURITY_SAFETY', label: 'Security & Safety' },
  { value: 'EXTERNAL_AREAS', label: 'External Areas' },
  { value: 'COMMUNAL_AREAS', label: 'Communal Areas' },
  { value: 'CLEANING_GENERAL', label: 'Cleaning & General' },
  { value: 'OTHER_GENERAL_MAINTENANCE', label: 'Other / General Maintenance' },
];

// ---------- Support tickets ----------

export const SUPPORT_TICKET_TYPE_OPTIONS = [
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
] as const;

export const SUPPORT_TICKET_PRIORITY_OPTIONS = [
  { value: 'URGENT', label: 'Urgent' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'WHEN_POSSIBLE', label: 'When Possible' },
] as const;

export const SUPPORT_TICKET_STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
] as const;
