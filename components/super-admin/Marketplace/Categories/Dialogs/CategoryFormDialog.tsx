'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import MarketplaceCategoryIcon from '@/components/common/MarketplaceCategoryIcon/MarketplaceCategoryIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateMarketplaceCategoryMutation,
  useUpdateMarketplaceCategoryMutation,
} from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import {
  CategoryFormDialogProps,
  MarketplaceCategoryForm,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { parseLucideIcon, toLucideJsx } from '@/utils/lucideIcon';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  onClose,
  category,
  nextDisplayOrder = 1,
}) => {
  const isEdit = !!category;

  const [form, setForm] = useState<MarketplaceCategoryForm>({
    name: category?.name ?? '',
    description: category?.description ?? '',
    icon: category?.icon ? toLucideJsx(category.icon) : '',
    display_order: String(category?.display_order ?? nextDisplayOrder),
    is_active: category?.is_active ?? true,
  });
  // Lucide kebab-case name parsed from the pasted JSX (null if empty/invalid).
  const iconName = parseLucideIcon(form.icon);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState<string | null>(null);

  const [createCategory, { isLoading: isCreating }] =
    useCreateMarketplaceCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateMarketplaceCategoryMutation();
  const isLoading = isCreating || isUpdating;

  function set<K extends keyof MarketplaceCategoryForm>(
    key: K,
    value: MarketplaceCategoryForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (form.icon.trim() && !iconName)
      next.icon =
        'Not a Lucide icon. Paste the JSX from lucide.dev, e.g. <Check />.';
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
        if (key in form) fieldErrors[key] = message;
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
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      icon: iconName,
      display_order: Number(form.display_order),
      is_active: form.is_active,
    };

    try {
      if (isEdit && category) {
        await updateCategory({ alias: category.alias, payload }).unwrap();
        toast.success('Category updated successfully.');
      } else {
        await createCategory(payload).unwrap();
        toast.success('Category created successfully.');
      }
      onClose();
    } catch (err) {
      handleApiError((err as { data?: unknown })?.data);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update how this category appears in the marketplace.'
              : 'Create a new category for marketplace providers.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          {bannerError && (
            <p className='border-danger/30 bg-danger/10 text-danger rounded-md border px-3 py-2 text-sm'>
              {bannerError}
            </p>
          )}

          <Field data-invalid={!!errors.name}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Name<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='text'
              placeholder='e.g. Broadband Providers'
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={!!errors.name}
              autoFocus
            />
            <FieldError errors={[{ message: errors.name }]} />
          </Field>

          <Field data-invalid={!!errors.icon}>
            <div className='flex items-center justify-between gap-2'>
              <FieldLabel className='text-sm font-semibold'>Icon</FieldLabel>
              <a
                href='https://lucide.dev/icons'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary inline-flex items-center gap-1 text-xs hover:underline'
              >
                Browse Lucide icons
                <ExternalLink className='size-3' />
              </a>
            </div>
            <div className='flex items-center gap-3'>
              <MarketplaceCategoryIcon icon={iconName} seed={category?.alias} />
              <Input
                type='text'
                placeholder='Paste JSX, e.g. <Check />'
                value={form.icon}
                onChange={(e) => set('icon', e.target.value)}
                aria-invalid={!!errors.icon}
                className='font-mono text-sm'
              />
            </div>
            {errors.icon ? (
              <FieldError errors={[{ message: errors.icon }]} />
            ) : (
              <FieldDescription>
                {iconName
                  ? `Using the "${iconName}" icon.`
                  : 'On lucide.dev, open an icon, click "Copy JSX" and paste it here.'}
              </FieldDescription>
            )}
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel className='text-sm font-semibold'>
              Description
            </FieldLabel>
            <Textarea
              placeholder='Short description of this category (optional)'
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              aria-invalid={!!errors.description}
            />
            <FieldError errors={[{ message: errors.description }]} />
          </Field>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field data-invalid={!!errors.display_order}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Display Order<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='number'
                min={0}
                value={form.display_order}
                onChange={(e) => set('display_order', e.target.value)}
                aria-invalid={!!errors.display_order}
              />
              <FieldError errors={[{ message: errors.display_order }]} />
            </Field>

            <Field>
              <FieldLabel className='text-sm font-semibold'>Status</FieldLabel>
              <div className='flex h-9 items-center gap-3'>
                <Switch
                  id='category-active'
                  checked={form.is_active}
                  onCheckedChange={(value) => set('is_active', value)}
                />
                <Label
                  htmlFor='category-active'
                  className='cursor-pointer font-normal'
                >
                  {form.is_active ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </Field>
          </div>

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
              {isEdit ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
