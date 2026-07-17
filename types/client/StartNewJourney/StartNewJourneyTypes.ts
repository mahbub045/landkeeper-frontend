// types/client/Common/StartNewJourney/WizardTypes.ts

import { DetailsForm } from '@/types/client/Common/Properties/PropertyTypes';
import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';
import { TenantForm } from '@/types/client/Common/Tenant/TenantTypes';
import { CertificateForm } from '@/types/client/Common/Compliance/ComplianceTypes';
import { DocumentForm } from '@/types/client/Common/Documents/DocumentTypes';

export type WizardTab =
  | 'property'
  | 'mortgage'
  | 'tenant'
  | 'compliance'
  | 'document';

export const WIZARD_TABS: WizardTab[] = [
  'property',
  'mortgage',
  'tenant',
  'compliance',
  'document',
];

export const WIZARD_TAB_LABELS: Record<WizardTab, string> = {
  property: 'Property Details',
  mortgage: 'Mortgage',
  tenant: 'Tenant',
  compliance: 'Certificates',
  document: 'Documents',
};

// propertyId is dropped from every section — everything is created together
// under the single property being built in this wizard.
export interface WizardState {
  property: DetailsForm;
  propertyFiles: File[];

  mortgage: Omit<MortgageForm, 'propertyId'>;
  mortgageFiles: File[];

  tenant: Omit<TenantForm, 'propertyId'>;
  tenantAvatar: File | null;

  compliance: Omit<CertificateForm, 'propertyId'>;
  complianceFile: File | null;

  document: Omit<DocumentForm, 'propertyId'>;
  documentFile: File | null;
}

export type WizardErrors = Record<WizardTab, Record<string, string>>;

export const EMPTY_WIZARD_ERRORS: WizardErrors = {
  property: {},
  mortgage: {},
  tenant: {},
  compliance: {},
  document: {},
};