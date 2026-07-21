// types/client/Common/StartNewJourney/WizardTypes.ts

import { ComplianceStepValue } from '@/components/client/Common/StartNewJourney/Components/ComplianceTab';
import { DocumentStepValue } from '@/components/client/Common/StartNewJourney/Components/DocumentsTab';
import { MortgageStepValue } from '@/components/client/Common/StartNewJourney/Components/MortgageTab';
import { TenantStepValue } from '@/components/client/Common/StartNewJourney/Components/TenantTab';
import { CertificateForm } from '@/types/client/Common/Compliance/ComplianceTypes';
import { DocumentForm } from '@/types/client/Common/Documents/DocumentTypes';
import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';
import { DetailsForm } from '@/types/client/Common/Properties/PropertyTypes';
import { TenantForm } from '@/types/client/Common/Tenant/TenantTypes';

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
  complianceFiles: File[];

  document: Omit<DocumentForm, 'propertyId'>;
  documentFiles: File[];
}

export type WizardErrors = Record<WizardTab, Record<string, string>>;

export const EMPTY_WIZARD_ERRORS: WizardErrors = {
  property: {},
  mortgage: {},
  tenant: {},
  compliance: {},
  document: {},
};

export interface PropertyDetailsStepProps {
  active: boolean;
  value: DetailsForm;
  onChange: (v: DetailsForm) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  errors: Record<string, string>;
}

export interface TenantStepProps {
  active: boolean;
  value: TenantStepValue;
  onChange: (v: TenantStepValue) => void;
  avatarFile: File | null;
  avatarPreview: string | null;
  onAvatarChange: (file: File | null, preview: string | null) => void;
  errors: Record<string, string>;
}

export interface ComplianceStepProps {
  active: boolean;
  value: ComplianceStepValue;
  onChange: (v: ComplianceStepValue) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  errors: Record<string, string>;
}

export interface DocumentStepProps {
  active: boolean;
  value: DocumentStepValue;
  onChange: (v: DocumentStepValue) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  errors: Record<string, string>;
}

export interface MortgageStepProps {
  active: boolean;
  value: MortgageStepValue;
  onChange: (v: MortgageStepValue) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  errors: Record<string, string>;
}
