'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TITLE_OPTIONS } from '@/data/common/TitleOptions';
import { cn } from '@/lib/utils';
import { useEditLandlordMutation } from '@/store/api/endpoints/super-admin/Landlords/Overview/OverviewApi';
import {
  EditPersonalInfoDialogProps,
  FormFieldProps,
  LandlordType,
  PersonalInfoForm,
} from '@/types/super-admin/Landlords/Overview/OverviewType';
import { Check, UserPen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const getFormData = (landlord: LandlordType): PersonalInfoForm => ({
  title: landlord.title ?? '',
  first_name: landlord.first_name ?? '',
  middle_name: landlord.middle_name ?? '',
  last_name: landlord.last_name ?? '',
  phone: landlord.phone ?? '',
  current_address: landlord.current_address ?? '',
  ni_number: landlord.ni_number ?? '',
  utr_number: landlord.utr_number ?? '',
});

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required,
  className,
  children,
}) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label htmlFor={id} className='text-sm font-medium'>
      {label}
      {required && <span className='text-danger'>*</span>}
    </Label>
    {children}
  </div>
);

const EditPersonalInfoDialog: React.FC<EditPersonalInfoDialogProps> = ({
  open,
  onClose,
  landlord,
  landlord_alias,
}) => {
  const [formData, setFormData] = useState<PersonalInfoForm>(() =>
    getFormData(landlord),
  );
  const [prevOpen, setPrevOpen] = useState(open);
  const [editLandlord, { isLoading: isSaving }] = useEditLandlordMutation();

  // Reset the form to the latest landlord data each time the dialog opens
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setFormData(getFormData(landlord));
  }

  const handleChange = (field: keyof PersonalInfoForm, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editLandlord({ landlord_alias, data: formData }).unwrap();
      toast.success('Personal information updated successfully.');
      onClose();
    } catch {
      toast.error('Failed to update personal information. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isSaving && onClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-2xl'>
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg'>
              <UserPen className='size-5' />
            </div>
            <div className='text-left'>
              <DialogTitle className='text-foreground text-xl font-bold'>
                Edit Personal Information
              </DialogTitle>
              <DialogDescription>
                Update the landlord&apos;s name, contact and tax details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='flex flex-1 flex-col overflow-hidden'
        >
          <div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
            {/* Name */}
            <section className='space-y-3'>
              <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                Name
              </p>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <FormField id='title' label='Title' required>
                  <Select
                    value={formData.title}
                    onValueChange={(value) => handleChange('title', value)}
                    disabled={isSaving}
                    required
                  >
                    <SelectTrigger id='title' className='w-full'>
                      <SelectValue placeholder='Select title' />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id='first_name' label='First Name' required>
                  <Input
                    type='text'
                    id='first_name'
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder='First Name'
                    required
                    disabled={isSaving}
                  />
                </FormField>
                <FormField id='middle_name' label='Middle Name'>
                  <Input
                    type='text'
                    id='middle_name'
                    value={formData.middle_name}
                    onChange={(e) =>
                      handleChange('middle_name', e.target.value)
                    }
                    placeholder='Middle Name'
                    disabled={isSaving}
                  />
                </FormField>
                <FormField id='last_name' label='Last Name' required>
                  <Input
                    type='text'
                    id='last_name'
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder='Last Name'
                    required
                    disabled={isSaving}
                  />
                </FormField>
              </div>
            </section>

            {/* Contact */}
            <section className='space-y-3'>
              <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                Contact
              </p>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <FormField id='email' label='Email'>
                  <Input
                    id='email'
                    type='email'
                    value={landlord.email}
                    disabled
                  />
                </FormField>
                <FormField id='phone' label='Phone'>
                  <Input
                    type='text'
                    id='phone'
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder='Phone'
                    disabled={isSaving}
                  />
                </FormField>
                <FormField
                  id='current_address'
                  label='Current Address'
                  className='sm:col-span-2'
                >
                  <Input
                    type='text'
                    id='current_address'
                    value={formData.current_address}
                    onChange={(e) =>
                      handleChange('current_address', e.target.value)
                    }
                    placeholder='Current Address'
                    disabled={isSaving}
                  />
                </FormField>
              </div>
            </section>

            {/* Tax & identification */}
            <section className='space-y-3'>
              <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                Tax & Identification
              </p>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <FormField id='ni_number' label='NI Number'>
                  <Input
                    type='text'
                    id='ni_number'
                    value={formData.ni_number}
                    onChange={(e) => handleChange('ni_number', e.target.value)}
                    placeholder='NI Number'
                    disabled={isSaving}
                  />
                </FormField>
                <FormField id='utr_number' label='UTR Number'>
                  <Input
                    type='text'
                    id='utr_number'
                    value={formData.utr_number}
                    onChange={(e) => handleChange('utr_number', e.target.value)}
                    placeholder='UTR Number'
                    disabled={isSaving}
                  />
                </FormField>
              </div>
            </section>
          </div>

          <div className='bg-muted/30 flex shrink-0 justify-end gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSaving}>
              {isSaving ? (
                <Loading className='text-white!' />
              ) : (
                <Check className='size-4' />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPersonalInfoDialog;
