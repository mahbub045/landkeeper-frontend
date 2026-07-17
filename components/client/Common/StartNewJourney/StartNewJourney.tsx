// const StartNewJourney: React.FC = () => {
//   return (
//     <div>
//       Test
//     </div>
//   );
// };

// export default StartNewJourney;

'use client';

// components/StartNewJourney/StartNewJourneyWizard.tsx

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { EMPTY_DETAILS_FORM } from '@/data/client/common/properties/PropertiesData';

import { snakeToCamel } from '@/utils/formatters';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAddNewJourneyMutation } from '@/store/api/endpoints/client/StartNewJourney/StartNewJourneyApi';
import {
  EMPTY_WIZARD_ERRORS,
  WIZARD_TAB_LABELS,
  WIZARD_TABS,
  WizardErrors,
  WizardState,
  WizardTab,
} from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import ComplianceTab, {
  EMPTY_COMPLIANCE_STEP_FORM,
  validateComplianceStep,
} from './Components/ComplianceTab';
import DocumentsTab, {
  EMPTY_DOCUMENT_STEP_FORM,
  validateDocumentStep,
} from './Components/DocumentsTab';
import MortgageTab, {
  EMPTY_MORTGAGE_STEP_FORM,
  validateMortgageStep,
} from './Components/MortgageTab';
import PropertyTab, { validatePropertyStep } from './Components/PropertyTab';
import TenantTab, {
  EMPTY_TENANT_STEP_FORM,
  validateTenantStep,
} from './Components/TenantTab';

const EMPTY_STATE: WizardState = {
  property: EMPTY_DETAILS_FORM,
  propertyFiles: [],
  mortgage: EMPTY_MORTGAGE_STEP_FORM,
  mortgageFiles: [],
  tenant: EMPTY_TENANT_STEP_FORM,
  tenantAvatar: null,
  compliance: EMPTY_COMPLIANCE_STEP_FORM,
  complianceFile: null,
  document: EMPTY_DOCUMENT_STEP_FORM,
  documentFile: null,
};

// Maps a top-level payload section key (from a possible backend error
// response) back to a wizard tab, in case the API mirrors the request shape.
const SECTION_TO_TAB: Record<string, WizardTab> = {
  property: 'property',
  mortgage: 'mortgage',
  tenant: 'tenant',
  compliance: 'compliance',
  upload_document: 'document',
};

const StartNewJourney: React.FC = () => {
  const [state, setState] = useState<WizardState>(EMPTY_STATE);
  const [errors, setErrors] = useState<WizardErrors>(EMPTY_WIZARD_ERRORS);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WizardTab>('property');
  const [tenantAvatarPreview, setTenantAvatarPreview] = useState<string | null>(
    null,
  );
  const [pendingValidateTab, setPendingValidateTab] =
    useState<WizardTab | null>(null);

  const [addNewJourney, { isLoading: submitting }] = useAddNewJourneyMutation();

  const formRefs = useRef<Record<WizardTab, HTMLFormElement | null>>({
    property: null,
    mortgage: null,
    tenant: null,
    compliance: null,
    document: null,
  });

  // After switching to a tab in order to surface a validation error there,
  // wait for it to actually render (hidden -> visible) before calling
  // reportValidity(), otherwise the native bubble has nothing to anchor to.
  useEffect(() => {
    if (!pendingValidateTab || activeTab !== pendingValidateTab) return;

    const form = formRefs.current[pendingValidateTab];
    const rafId = requestAnimationFrame(() => {
      form?.reportValidity();
      setPendingValidateTab(null);
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeTab, pendingValidateTab]);
  function getManualErrors(tab: WizardTab): Record<string, string> {
    switch (tab) {
      case 'property':
        return validatePropertyStep(state.propertyFiles);
      case 'mortgage':
        return validateMortgageStep(state.mortgage);
      case 'tenant':
        return validateTenantStep(state.tenant);
      case 'compliance':
        return validateComplianceStep(state.compliance);
      case 'document':
        return validateDocumentStep(state.documentFile);
    }
  }

  // Runs native checkValidity() (works even on hidden forms) plus each
  // step's manual guard for non-native controls (Select, dropzones).
  // Updates errors for that tab either way and returns whether it passed.
  function validateTab(tab: WizardTab): boolean {
    const form = formRefs.current[tab];
    const nativeValid = form ? form.checkValidity() : true;
    const manualErrors = getManualErrors(tab);

    setErrors((prev) => ({ ...prev, [tab]: manualErrors }));

    return nativeValid && Object.keys(manualErrors).length === 0;
  }

  function handleTabClick(tab: WizardTab) {
    // Free navigation — no validation gate on a direct tab click.
    setActiveTab(tab);
  }

  function handleNext() {
    const idx = WIZARD_TABS.indexOf(activeTab);
    if (!validateTab(activeTab)) {
      formRefs.current[activeTab]?.reportValidity();
      return;
    }
    const next = WIZARD_TABS[idx + 1];
    if (next) setActiveTab(next);
  }

  function handleBack() {
    const idx = WIZARD_TABS.indexOf(activeTab);
    const prev = WIZARD_TABS[idx - 1];
    if (prev) setActiveTab(prev);
  }

  function resetWizard() {
    setState(EMPTY_STATE);
    setErrors(EMPTY_WIZARD_ERRORS);
    setBannerError(null);
    setActiveTab('property');
    if (tenantAvatarPreview) URL.revokeObjectURL(tenantAvatarPreview);
    setTenantAvatarPreview(null);
  }

  function handleApiError(err: unknown) {
    const data = (err as { data?: Record<string, unknown> })?.data;
    if (!data || typeof data !== 'object') {
      toast.error('Something went wrong. Please try again.');
      return;
    }

    const nextErrors: WizardErrors = {
      property: {},
      mortgage: {},
      tenant: {},
      compliance: {},
      document: {},
    };
    let firstInvalidTab: WizardTab | null = null;
    let matchedAnySection = false;

    for (const [sectionKey, sectionValue] of Object.entries(data)) {
      const tab = SECTION_TO_TAB[sectionKey];
      if (!tab || typeof sectionValue !== 'object' || sectionValue === null)
        continue;

      matchedAnySection = true;
      for (const [field, val] of Object.entries(
        sectionValue as Record<string, unknown>,
      )) {
        nextErrors[tab][snakeToCamel(field)] = Array.isArray(val)
          ? String(val[0])
          : String(val);
      }
      if (!firstInvalidTab && Object.keys(nextErrors[tab]).length > 0) {
        firstInvalidTab = tab;
      }
    }

    if (matchedAnySection) {
      setErrors(nextErrors);
      if (firstInvalidTab) setActiveTab(firstInvalidTab);
      toast.error('Please fix the highlighted fields and try again.');
      return;
    }

    const message = (data.detail as string) ?? (data.message as string);
    if (message) {
      setBannerError(message);
      toast.error(message);
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  }

  async function handleSave() {
  setBannerError(null);

  for (const tab of WIZARD_TABS) {
    if (!validateTab(tab)) {
      setActiveTab(tab);
      setPendingValidateTab(tab);
      toast.error(
        `Please complete the required fields in "${WIZARD_TAB_LABELS[tab]}".`,
      );
      return;
    }
  }

  const fd = new FormData();

const p = state.property;
fd.append('property', JSON.stringify({
  property_name: p.name,
  property_type: p.type,
  status: p.status,
  address: p.address,
  purchase_price: p.purchasePrice,
  current_value: p.currentValue,
  rent_per_month: p.rentPerMonth,
  purchase_date: p.purchaseDate,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  notes: p.notes,
}));
state.propertyFiles.forEach((file) => fd.append('documents_data', file));

const m = state.mortgage;
fd.append('mortgage', JSON.stringify({
  lender_name: m.lenderName,
  product_type: m.productType,
  interest_rate: m.interestRate,
  loan_amount: m.loanAmount,
  outstanding_balance: m.outstandingBalance,
  monthly_payment: m.monthlyPayment,
  term: m.termYears,
  start_date: m.startDate || null,
  end_date: m.endDate || null,
  broker_notes: m.brokerNotes,
}));
state.mortgageFiles.forEach((file) => fd.append('mortgage_documents', file));

const t = state.tenant;
fd.append('tenant', JSON.stringify({
  title: t.title,
  first_name: t.firstName,
  middle_name: t.middleName,
  last_name: t.lastName,
  email: t.email,
  phone: t.phone,
  rent_amount: t.rentAmount,
  deposit: t.deposit,
  tenancy_start_date: t.tenancyStart,
  tenancy_end_date: t.tenancyEnd || null,
  employment_details: t.employmentDetails,
  guarantor_name: t.guarantorName,
  notes: t.notes,
  is_active: true,
}));
if (state.tenantAvatar) fd.append('avatar', state.tenantAvatar);

const c = state.compliance;
fd.append('compliance', JSON.stringify({
  certificate_type: c.certificateType,
  issue_date: c.issueDate,
  expiry_date: c.expiryDate,
  certificate_number: c.certificateNumber,
  issued_by: c.issuedBy,
}));
if (state.complianceFile) fd.append('certificate_file', state.complianceFile);

const d = state.document;
fd.append('upload_document', JSON.stringify({
  document_category: d.category,
  document_name: d.name.trim(),
  tags: d.tags.trim(),
}));
if (state.documentFile) fd.append('uploaded_files', state.documentFile);

  // ── Document ──
 

  try {
    await addNewJourney(fd).unwrap();
    toast.success('Property created successfully.');
    resetWizard();
  } catch (err) {
    handleApiError(err);
  }
}

  const isLastTab = activeTab === WIZARD_TABS[WIZARD_TABS.length - 1];
  const isFirstTab = activeTab === WIZARD_TABS[0];

  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-xl border'>
      {/* Tab strip */}
      <div className='flex gap-6 border-b px-6 pt-6'>
        {WIZARD_TABS.map((tab) => {
          const hasError = Object.keys(errors[tab]).length > 0;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type='button'
              onClick={() => handleTabClick(tab)}
              className={[
                'pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary border-primary border-b-2'
                  : hasError
                    ? 'text-danger'
                    : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {WIZARD_TAB_LABELS[tab]}
              {hasError && !isActive && (
                <span className='bg-danger ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle' />
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className='px-6 py-5'>
        {bannerError && (
          <p className='text-danger mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
            {bannerError}
          </p>
        )}

        <PropertyTab
          ref={(el) => {
            formRefs.current.property = el;
          }}
          active={activeTab === 'property'}
          value={state.property}
          onChange={(v) => setState((s) => ({ ...s, property: v }))}
          files={state.propertyFiles}
          onFilesChange={(files) =>
            setState((s) => ({ ...s, propertyFiles: files }))
          }
          errors={errors.property}
        />

        <MortgageTab
          ref={(el) => {
            formRefs.current.mortgage = el;
          }}
          active={activeTab === 'mortgage'}
          value={state.mortgage}
          onChange={(v) => setState((s) => ({ ...s, mortgage: v }))}
          files={state.mortgageFiles}
          onFilesChange={(files) =>
            setState((s) => ({ ...s, mortgageFiles: files }))
          }
          errors={errors.mortgage}
        />

        <TenantTab
          ref={(el) => {
            formRefs.current.tenant = el;
          }}
          active={activeTab === 'tenant'}
          value={state.tenant}
          onChange={(v) => setState((s) => ({ ...s, tenant: v }))}
          avatarFile={state.tenantAvatar}
          avatarPreview={tenantAvatarPreview}
          onAvatarChange={(file, preview) => {
            setState((s) => ({ ...s, tenantAvatar: file }));
            setTenantAvatarPreview(preview);
          }}
          errors={errors.tenant}
        />

        <ComplianceTab
          ref={(el) => {
            formRefs.current.compliance = el;
          }}
          active={activeTab === 'compliance'}
          value={state.compliance}
          onChange={(v) => setState((s) => ({ ...s, compliance: v }))}
          file={state.complianceFile}
          onFileChange={(file) =>
            setState((s) => ({ ...s, complianceFile: file }))
          }
          errors={errors.compliance}
        />

        <DocumentsTab
          ref={(el) => {
            formRefs.current.document = el;
          }}
          active={activeTab === 'document'}
          value={state.document}
          onChange={(v) => setState((s) => ({ ...s, document: v }))}
          file={state.documentFile}
          onFileChange={(file) =>
            setState((s) => ({ ...s, documentFile: file }))
          }
          errors={errors.document}
        />
      </div>

      {/* Footer */}
      <div className='flex shrink-0 items-center justify-between gap-3 border-t px-6 py-4'>
        <Button
          type='button'
          variant='outline'
          onClick={handleBack}
          disabled={isFirstTab || submitting}
        >
          Back
        </Button>

        <div className='flex items-center gap-3'>
          {!isLastTab && (
            <Button type='button' onClick={handleNext} disabled={submitting}>
              Next
            </Button>
          )}
          {isLastTab && (
            <Button type='button' onClick={handleSave} disabled={submitting}>
              {submitting && <Loading className='text-white!' />}
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartNewJourney;
