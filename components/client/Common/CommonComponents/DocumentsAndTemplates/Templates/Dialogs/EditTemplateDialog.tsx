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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditTemplateMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/TemplatesApi';
import { EditTemplateDialogProps } from '@/types/client/Common/DocumentsAndTemplates/TemplatesTypes';
import { useState } from 'react';
import { toast } from 'sonner';

type FieldErrors = Record<string, string[]>;

// Normalizes RTK Query / DRF-style error responses into a flat
// { fieldName: string[] } map, regardless of exact shape.
function extractFieldErrors(error: unknown): FieldErrors {
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object'
  ) {
    const data = error.data as Record<string, unknown>;
    const fieldErrors: FieldErrors = {};

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map(String);
      } else if (typeof value === 'string') {
        fieldErrors[key] = [value];
      }
    }

    return fieldErrors;
  }

  return {};
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  isOpen,
  setIsOpen,
  template,
}) => {
  const [updateTemplate, { isLoading }] = useEditTemplateMutation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Tracks which template's data is currently loaded into the form fields.
  const [loadedAlias, setLoadedAlias] = useState<string | null>(null);

  if (isOpen && template && template.alias !== loadedAlias) {
    setLoadedAlias(template.alias);
    setTitle(template.title);
    setCategory(template.category);
    setFieldErrors({});
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!template) return;

    if (!title.trim() || !category.trim()) {
      toast.warning('Please fill in both title and category.');
      return;
    }

    setFieldErrors({});

    try {
      await updateTemplate({
        templateAlias: template.alias,
        formData: {
          title: title.trim(),
          category: category.trim(),
        },
      }).unwrap();
      toast.success('Template updated.');
      setIsOpen(false);
    } catch (error) {
      const errors = extractFieldErrors(error);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
      } else {
        toast.error('Failed to update template. Please try again.');
      }
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setFieldErrors({});
      }}
    >
      <DialogContent className='rounded-sm sm:max-w-105'>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle className='text-primary text-[16px] font-semibold'>
              Edit Template
            </DialogTitle>
            <DialogDescription className='text-[13px] text-[#5B6472]'>
              Update the title and category for this template.
            </DialogDescription>
          </DialogHeader>

          <div className='mt-4 space-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='template-title' className='text-[13px]'>
                Title
              </Label>
              <Input
                type='text'
                id='template-title'
                value={title}
                disabled={isLoading}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (fieldErrors.title) {
                    setFieldErrors((prev) => ({ ...prev, title: [] }));
                  }
                }}
                placeholder='e.g. Master Services Agreement'
                aria-invalid={!!fieldErrors.title?.length}
                className='aria-invalid:border-danger rounded-sm'
              />
              {fieldErrors.title?.map((msg, i) => (
                <p key={i} className='text-danger text-[12px]'>
                  {msg}
                </p>
              ))}
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='template-category' className='text-[13px]'>
                Category
              </Label>
              <Input
                type='text'
                id='template-category'
                value={category}
                disabled={isLoading}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (fieldErrors.category) {
                    setFieldErrors((prev) => ({ ...prev, category: [] }));
                  }
                }}
                placeholder='e.g. Lease Agreement'
                aria-invalid={!!fieldErrors.category?.length}
                className='aria-invalid:border-danger rounded-sm'
              />
              {fieldErrors.category?.map((msg, i) => (
                <p key={i} className='text-danger text-[12px]'>
                  {msg}
                </p>
              ))}
            </div>

            {/* Catch-all for non-field errors, e.g. { non_field_errors: [...] } or { detail: "..." } */}
            {(fieldErrors.non_field_errors || fieldErrors.detail) && (
              <p className='text-danger text-[12px]'>
                {(fieldErrors.non_field_errors ?? fieldErrors.detail)?.join(
                  ' ',
                )}
              </p>
            )}
          </div>

          <DialogFooter className='mt-6 gap-2 sm:gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
              className='rounded-sm'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              size='sm'
              disabled={isLoading || !title.trim() || !category.trim()}
              className='rounded-sm'
            >
              {isLoading && <Loading className='text-white!' />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
