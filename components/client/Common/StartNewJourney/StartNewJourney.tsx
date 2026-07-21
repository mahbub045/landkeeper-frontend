'use client';

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
  complianceFiles: [],
  document: EMPTY_DOCUMENT_STEP_FORM,
  documentFiles: [],
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
        return validateDocumentStep(state.documentFiles);
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

    // ── Property ──
    const p = state.property;
    fd.append('property_property_name', p.name ?? '');
    fd.append('property_property_type', p.type ?? '');
    fd.append('property_status', p.status ?? '');
    fd.append('property_address', p.address ?? '');
    fd.append('property_purchase_price', String(p.purchasePrice ?? ''));
    fd.append('property_current_value', String(p.currentValue ?? ''));
    fd.append('property_rent_per_month', String(p.rentPerMonth ?? ''));
    fd.append('property_purchase_date', p.purchaseDate);
    fd.append('property_bedrooms', p.bedrooms);
    fd.append('property_bathrooms', p.bathrooms);
    fd.append('property_notes', p.notes ?? '');
    state.propertyFiles.forEach((file) =>
      fd.append('property_documents_data', file),
    );

    // ── Mortgage ──
    const m = state.mortgage;
    fd.append('mortgage_lender_name', m.lenderName ?? '');
    fd.append('mortgage_product_type', m.productType ?? '');
    fd.append('mortgage_interest_rate', m.interestRate ?? '');
    fd.append('mortgage_loan_amount', m.loanAmount ?? '');
    fd.append('mortgage_outstanding_balance', m.outstandingBalance ?? '');
    fd.append('mortgage_monthly_payment', m.monthlyPayment ?? '');
    fd.append('mortgage_term', m.termYears ?? '');
    fd.append('mortgage_start_date', m.startDate);
    fd.append('mortgage_end_date', m.endDate);
    fd.append('mortgage_broker_notes', m.brokerNotes ?? '');
    state.mortgageFiles.forEach((file) =>
      fd.append('mortgage_mortgage_documents', file),
    );

    // ── Tenant ──
    const t = state.tenant;
    fd.append('tenant_title', t.title ?? '');
    fd.append('tenant_first_name', t.firstName ?? '');
    fd.append('tenant_middle_name', t.middleName ?? '');
    fd.append('tenant_last_name', t.lastName ?? '');
    fd.append('tenant_email', t.email ?? '');
    fd.append('tenant_phone', t.phone ?? '');
    fd.append('tenant_rent_amount', t.rentAmount ?? '');
    fd.append('tenant_deposit', t.deposit ?? '');
    fd.append('tenant_tenancy_start_date', t.tenancyStart ?? '');
    fd.append('tenant_tenancy_end_date', t.tenancyEnd ?? '');
    fd.append('tenant_employment_details', t.employmentDetails ?? '');
    fd.append('tenant_guarantor_name', t.guarantorName ?? '');
    fd.append('tenant_notes', t.notes ?? '');
    fd.append('tenant_is_active', 'true');
    if (state.tenantAvatar) fd.append('tenant_avatar', state.tenantAvatar);

    // ── Compliance ──
    const c = state.compliance;
    fd.append('compliance_certificate_type', c.certificateType ?? '');
    fd.append('compliance_issue_date', c.issueDate ?? '');
    fd.append('compliance_expiry_date', c.expiryDate ?? '');
    fd.append('compliance_certificate_number', c.certificateNumber ?? '');
    fd.append('compliance_issued_by', c.issuedBy ?? '');
    state.complianceFiles.forEach((file) =>
      fd.append('compliance_certificate_file', file),
    );

    // ── Document ──
    const d = state.document;
    fd.append('upload_document_document_category', d.category ?? '');
    fd.append('upload_document_document_name', d.name.trim());
    fd.append('upload_document_tags', d.tags.trim());
    state.documentFiles.forEach((file) =>
      fd.append('upload_document_uploaded_files', file),
    );

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
      {/* Heading */}
      <div className='border-b px-6 pt-6 pb-5'>
        <h2 className='text-xl font-semibold'>Start Your Journey Here</h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          Fill up the sections below to add your property, mortgage, tenant, and
          compliance details.
        </p>
      </div>

      {/* Tab strip */}
      <div className='flex flex-wrap justify-center gap-3 border-b px-6 py-5'>
        {WIZARD_TABS.map((tab) => {
          const hasError = Object.keys(errors[tab]).length > 0;
          const isActive = activeTab === tab;
          return (
            <Button
              key={tab}
              type='button'
              variant={isActive ? 'secondary' : 'outline'}
              onClick={() => handleTabClick(tab)}
              className={[
                'cursor-pointer rounded-md px-5 font-semibold',
                !isActive && hasError
                  ? 'border-danger text-danger hover:bg-danger/5'
                  : '',
              ].join(' ')}
            >
              {WIZARD_TAB_LABELS[tab]}
              {hasError && !isActive && (
                <span className='bg-danger ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle' />
              )}
            </Button>
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
          files={state.complianceFiles}
          onFilesChange={(files) =>
            setState((s) => ({ ...s, complianceFiles: files }))
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
          files={state.documentFiles}
          onFilesChange={(files) =>
            setState((s) => ({ ...s, documentFiles: files }))
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
