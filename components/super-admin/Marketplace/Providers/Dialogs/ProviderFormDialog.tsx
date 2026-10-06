'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  useCreateMarketplaceProviderMutation,
  useGetMarketplaceCategoriesQuery,
  useUpdateMarketplaceProviderMutation,
} from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import {
  MarketplaceProviderForm,
  MarketplaceProviderPayload,
  ProviderFormDialogProps,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { Check, ImagePlus, Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const MAX_LOGO_SIZE_MB = 2;

// Builds the multipart body used when a logo file is uploaded. Arrays are
// sent as repeated keys (category_aliases=a&category_aliases=b).
function toFormData(payload: MarketplaceProviderPayload, logo: File) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value))
      value.forEach((item) => formData.append(key, item));
    else formData.append(key, String(value));
  });
  formData.append('logo', logo);
  return formData;
}

const SWITCHES = [
  {
    key: 'is_active',
    label: 'Active',
    description: 'Shown to landlords in the marketplace.',
  },
  {
    key: 'is_verified',
    label: 'Verified',
    description: 'Shows a verified tick next to the name.',
  },
  {
    key: 'is_featured',
    label: 'Featured',
    description: 'Highlighted as a featured provider.',
  },
] as const;

const ProviderFormDialog: React.FC<ProviderFormDialogProps> = ({
  open,
  onClose,
  provider,
  nextDisplayOrder = 1,
}) => {
  const isEdit = !!provider;

  const [form, setForm] = useState<MarketplaceProviderForm>({
    name: provider?.name ?? '',
    short_description: provider?.short_description ?? '',
    description: provider?.description ?? '',
    services_offered: provider?.services_offered ?? [],
    website_url: provider?.website_url ?? '',
    referral_url: provider?.referral_url ?? '',
    contact_email: provider?.contact_email ?? '',
    contact_phone: provider?.contact_phone ?? '',
    address: provider?.address ?? '',
    is_verified: provider?.is_verified ?? false,
    is_featured: provider?.is_featured ?? false,
    is_active: provider?.is_active ?? true,
    display_order: String(provider?.display_order ?? nextDisplayOrder),
    category_aliases: provider?.categories.map((c) => c.alias) ?? [],
  });
  const [serviceInput, setServiceInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    provider?.logo ?? null,
  );
  // True when an existing logo was cleared without picking a new one.
  const [logoRemoved, setLogoRemoved] = useState(false);

  // Free the object URL created for a picked file.
  useEffect(() => {
    if (!logoPreview?.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(logoPreview);
  }, [logoPreview]);

  function clearLogoError() {
    setErrors((prev) => {
      if (!prev.logo) return prev;
      const next = { ...prev };
      delete next.logo;
      return next;
    });
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, logo: 'Please choose an image file.' }));
      return;
    }
    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: `Logo must be ${MAX_LOGO_SIZE_MB}MB or smaller.`,
      }));
      return;
    }

    clearLogoError();
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoRemoved(false);
  }

  function removeLogo() {
    clearLogoError();
    setLogoFile(null);
    setLogoPreview(null);
    // Only tell the API to clear it if the provider already had one.
    setLogoRemoved(!!provider?.logo);
  }

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetMarketplaceCategoriesQuery();
  const [createProvider, { isLoading: isCreating }] =
    useCreateMarketplaceProviderMutation();
  const [updateProvider, { isLoading: isUpdating }] =
    useUpdateMarketplaceProviderMutation();
  const isLoading = isCreating || isUpdating;

  function set<K extends keyof MarketplaceProviderForm>(
    key: K,
    value: MarketplaceProviderForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function toggleCategory(alias: string) {
    set(
      'category_aliases',
      form.category_aliases.includes(alias)
        ? form.category_aliases.filter((a) => a !== alias)
        : [...form.category_aliases, alias],
    );
  }

  function addService() {
    const value = serviceInput.trim();
    if (!value) return;
    const exists = form.services_offered.some(
      (s) => s.toLowerCase() === value.toLowerCase(),
    );
    if (!exists) set('services_offered', [...form.services_offered, value]);
    setServiceInput('');
  }

  function removeService(service: string) {
    set(
      'services_offered',
      form.services_offered.filter((s) => s !== service),
    );
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (form.category_aliases.length === 0)
      next.category_aliases = 'Select at least one category.';
    if (!form.website_url.trim()) next.website_url = 'Website URL is required.';
    else if (!isValidUrl(form.website_url.trim()))
      next.website_url = 'Enter a full URL, e.g. https://example.com';
    if (form.referral_url.trim() && !isValidUrl(form.referral_url.trim()))
      next.referral_url = 'Enter a full URL, e.g. https://example.com/?ref=x';
    if (
      form.contact_email.trim() &&
      !EMAIL_PATTERN.test(form.contact_email.trim())
    )
      next.contact_email = 'Enter a valid email address.';
    if (form.display_order === '' || Number(form.display_order) < 0)
      next.display_order = 'Enter a display order of 0 or more.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleApiError(body: unknown) {
    if (typeof body === 'object' && body !== null) {
      const apiError = body as Record<string, unknown>;
      const fieldErrors: Record<string, string> = {};
      const otherMessages: string[] = [];

      Object.entries(apiError).forEach(([key, val]) => {
        const message = Array.isArray(val) ? String(val[0]) : String(val);
        if (key in form || key === 'logo') fieldErrors[key] = message;
        else otherMessages.push(message);
      });

      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
      if (otherMessages.length > 0) setBannerError(otherMessages.join(' '));
      if (Object.keys(fieldErrors).length > 0 || otherMessages.length > 0) {
        toast.error('Please fix the highlighted fields and try again.');
        return;
      }
    }
    setBannerError('Something went wrong. Please try again.');
    toast.error('Something went wrong. Please try again.');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBannerError(null);
    if (!validate()) {
      toast.error('Please fix the highlighted fields and try again.');
      return;
    }

    const payload: MarketplaceProviderPayload = {
      name: form.name.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      services_offered: form.services_offered,
      website_url: form.website_url.trim(),
      referral_url: form.referral_url.trim(),
      contact_email: form.contact_email.trim(),
      contact_phone: form.contact_phone.trim(),
      address: form.address.trim(),
      is_verified: form.is_verified,
      is_featured: form.is_featured,
      is_active: form.is_active,
      display_order: Number(form.display_order),
      category_aliases: form.category_aliases,
      ...(logoRemoved && { logo: null }),
    };
    // A new logo has to go as multipart; otherwise keep the JSON body.
    const body = logoFile ? toFormData(payload, logoFile) : payload;

    try {
      if (isEdit && provider) {
        await updateProvider({ alias: provider.alias, payload: body }).unwrap();
        toast.success('Provider updated successfully.');
      } else {
        await createProvider(body).unwrap();
        toast.success('Provider created successfully.');
      }
      onClose();
    } catch (err) {
      handleApiError((err as { data?: unknown })?.data);
    }
  }

  const sectionTitle =
    'text-muted-foreground text-[11px] font-semibold tracking-wider uppercase';
  const label = 'gap-0 text-xs font-semibold';

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className='max-h-[90vh] gap-4 overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='gap-1'>
          <DialogTitle className='text-primary -mb-2 text-xl font-semibold'>
            {isEdit ? 'Edit Provider' : 'Add Provider'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update this provider’s marketplace listing.'
              : 'List a new company in the marketplace.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-5' noValidate>
          {bannerError && (
            <p className='border-danger/30 bg-danger/10 text-danger rounded-md border px-3 py-2 text-sm'>
              {bannerError}
            </p>
          )}

          {/* Basics */}
          <section className='space-y-3'>
            <h3 className={sectionTitle}>Basics</h3>

            <div className='flex gap-4'>
              {/* Logo */}
              <div className='shrink-0'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleLogoChange}
                />
                <div className='relative'>
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    aria-label={logoPreview ? 'Change logo' : 'Upload logo'}
                    title={`Logo — PNG, JPG, SVG or WebP, up to ${MAX_LOGO_SIZE_MB}MB`}
                    className={cn(
                      'group relative flex size-22 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 transition-colors',
                      logoPreview
                        ? 'border-border bg-white'
                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-primary border-dashed',
                      errors.logo && 'border-danger',
                    )}
                  >
                    {logoPreview ? (
                      <>
                        <Image
                          src={logoPreview}
                          alt='Logo preview'
                          fill
                          sizes='88px'
                          className='object-contain p-2'
                          unoptimized
                        />
                        <span className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100'>
                          <Upload className='size-4 text-white' />
                        </span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className='size-5' />
                        <span className='text-[11px] font-medium'>Logo</span>
                      </>
                    )}
                  </button>
                  {logoPreview && (
                    <button
                      type='button'
                      onClick={removeLogo}
                      aria-label='Remove logo'
                      className='bg-danger absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full text-white shadow-sm'
                    >
                      <X className='size-3' />
                    </button>
                  )}
                </div>
              </div>

              {/* Name + short description */}
              <div className='min-w-0 flex-1 space-y-3'>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel className={label}>
                    Name<span className='text-danger'>*</span>
                  </FieldLabel>
                  <Input
                    type='text'
                    placeholder='e.g. Acme Broadband'
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    autoFocus
                  />
                  <FieldError errors={[{ message: errors.name }]} />
                </Field>

                <Field data-invalid={!!errors.short_description}>
                  <FieldLabel className={label}>Short Description</FieldLabel>
                  <Input
                    type='text'
                    placeholder='One line shown under the name'
                    value={form.short_description}
                    onChange={(e) => set('short_description', e.target.value)}
                    aria-invalid={!!errors.short_description}
                  />
                  <FieldError
                    errors={[{ message: errors.short_description }]}
                  />
                </Field>
              </div>
            </div>
            <FieldError errors={[{ message: errors.logo }]} />

            <Field data-invalid={!!errors.description}>
              <FieldLabel className={label}>Description</FieldLabel>
              <Textarea
                placeholder='What the provider offers landlords'
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={2}
                className='min-h-16'
                aria-invalid={!!errors.description}
              />
              <FieldError errors={[{ message: errors.description }]} />
            </Field>
          </section>

          {/* Categories & services */}
          <section className='space-y-3'>
            <div className='space-y-2'>
              <h3 className={sectionTitle}>
                Categories<span className='text-danger'>*</span>
              </h3>
              {isCategoriesLoading ? (
                <Loading size={20} />
              ) : (
                <div className='flex flex-wrap gap-1.5'>
                  {categories?.map((category) => {
                    const selected = form.category_aliases.includes(
                      category.alias,
                    );
                    return (
                      <button
                        key={category.alias}
                        type='button'
                        aria-pressed={selected}
                        onClick={() => toggleCategory(category.alias)}
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                          selected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                        )}
                      >
                        {selected && <Check className='size-3' />}
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              )}
              <FieldError errors={[{ message: errors.category_aliases }]} />
            </div>

            <div className='space-y-2'>
              <h3 className={sectionTitle}>Services Offered</h3>
              <div className='flex gap-2'>
                <Input
                  type='text'
                  placeholder='e.g. Full Fibre — press Enter to add'
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addService();
                    }
                  }}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={addService}
                  disabled={!serviceInput.trim()}
                  aria-label='Add service'
                  className='shrink-0 h-10'
                >
                  <Plus /> Add Service
                </Button>
              </div>
              {form.services_offered.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {form.services_offered.map((service) => (
                    <span
                      key={service}
                      className='border-border text-foreground inline-flex items-center gap-1 rounded-md border py-0.5 pr-1 pl-2 text-xs'
                    >
                      {service}
                      <button
                        type='button'
                        aria-label={`Remove ${service}`}
                        onClick={() => removeService(service)}
                        className='text-muted-foreground hover:text-danger cursor-pointer rounded p-0.5'
                      >
                        <X className='size-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <FieldError errors={[{ message: errors.services_offered }]} />
            </div>
          </section>

          {/* Links & contact */}
          <section className='space-y-3'>
            <h3 className={sectionTitle}>Links & Contact</h3>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <Field data-invalid={!!errors.website_url}>
                <FieldLabel className={label}>
                  Website URL<span className='text-danger'>*</span>
                </FieldLabel>
                <Input
                  type='url'
                  placeholder='https://www.example.co.uk'
                  value={form.website_url}
                  onChange={(e) => set('website_url', e.target.value)}
                  aria-invalid={!!errors.website_url}
                />
                <FieldError errors={[{ message: errors.website_url }]} />
              </Field>

              <Field data-invalid={!!errors.referral_url}>
                <FieldLabel
                  className={label}
                  title='Used for “Visit Website” in the details modal.'
                >
                  Referral URL
                </FieldLabel>
                <Input
                  type='url'
                  placeholder='https://www.example.co.uk/'
                  value={form.referral_url}
                  onChange={(e) => set('referral_url', e.target.value)}
                  aria-invalid={!!errors.referral_url}
                />
                <FieldError errors={[{ message: errors.referral_url }]} />
              </Field>

              <Field data-invalid={!!errors.contact_email}>
                <FieldLabel className={label}>Contact Email</FieldLabel>
                <Input
                  type='email'
                  placeholder='partners@example.co.uk'
                  value={form.contact_email}
                  onChange={(e) => set('contact_email', e.target.value)}
                  aria-invalid={!!errors.contact_email}
                />
                <FieldError errors={[{ message: errors.contact_email }]} />
              </Field>

              <Field data-invalid={!!errors.contact_phone}>
                <FieldLabel className={label}>Contact Phone</FieldLabel>
                <Input
                  type='tel'
                  placeholder='+44 20 7946 0123'
                  value={form.contact_phone}
                  onChange={(e) => set('contact_phone', e.target.value)}
                  aria-invalid={!!errors.contact_phone}
                />
                <FieldError errors={[{ message: errors.contact_phone }]} />
              </Field>

              <Field data-invalid={!!errors.address} className='sm:col-span-2'>
                <FieldLabel className={label}>Address</FieldLabel>
                <Input
                  type='text'
                  placeholder='1 High Street, London, EC1A 1AA'
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  aria-invalid={!!errors.address}
                />
                <FieldError errors={[{ message: errors.address }]} />
              </Field>
            </div>
          </section>

          {/* Visibility */}
          <section className='space-y-3'>
            <h3 className={sectionTitle}>Visibility</h3>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
              <div className='border-border grid flex-1 grid-cols-3 divide-x rounded-lg border'>
                {SWITCHES.map(({ key, label: switchLabel, description }) => (
                  <Label
                    key={key}
                    htmlFor={`provider-${key}`}
                    title={description}
                    className='flex h-10 cursor-pointer items-center justify-between gap-2 px-3 text-xs font-semibold'
                  >
                    {switchLabel}
                    <Switch
                      id={`provider-${key}`}
                      checked={form[key]}
                      onCheckedChange={(value) => set(key, value)}
                    />
                  </Label>
                ))}
              </div>

              <Field data-invalid={!!errors.display_order} className='sm:w-32'>
                <FieldLabel className={label}>
                  Display Order<span className='text-danger'>*</span>
                </FieldLabel>
                <Input
                  type='number'
                  min={0}
                  value={form.display_order}
                  onChange={(e) => set('display_order', e.target.value)}
                  aria-invalid={!!errors.display_order}
                />
              </Field>
            </div>
            <FieldError errors={[{ message: errors.display_order }]} />
          </section>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loading className='text-white!' />}
              {isEdit ? 'Save Changes' : 'Create Provider'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderFormDialog;
