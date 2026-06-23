'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useEditProfileInfoMutation,
  useGetProfileInfoQuery,
} from '@/store/api/endpoints/profile-settings/ProfileApi';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Camera, Lock, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const ProfileSettings: React.FC = () => {
  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);
  const [editProfileInfo, { isLoading: isEditing }] =
    useEditProfileInfoMutation();

  const initialFormData = useMemo(
    () => ({
      title: profileData?.title ?? '',
      first_name: profileData?.first_name ?? '',
      middle_name: profileData?.middle_name ?? '',
      last_name: profileData?.last_name ?? '',
    }),
    [profileData],
  );

  const [formData, setFormData] = useState(initialFormData);

  // ✅ Sync once when profileData arrives — safe because it's conditional on external data
  const [initialized, setInitialized] = useState(false);
  if (profileData && !initialized) {
    setFormData(initialFormData);
    setInitialized(true);
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editProfileInfo(formData).unwrap();
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Remounts the form with correct defaultValues once profileData loads
  const formKey = isLoading ? 'loading' : 'loaded';

  return (
    <Card className='pt-0'>
      <CardContent className='space-y-5 p-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-foreground text-sm font-semibold'>
            Profile Settings
          </h2>
        </div>

        {/* Avatar + Name */}
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Avatar size='default' className='size-16'>
              <AvatarImage
                src={profileData?.profile_image ?? undefined}
                alt='Profile'
              />
              <AvatarFallback>
                {getInitials(profileData?.first_name) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <button
              type='button'
              className='bg-primary text-primary-foreground absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full'
            >
              <Camera className='size-4' />
            </button>
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold'>
              {formatChoiceFieldValue(profileData?.title)}{' '}
              {profileData?.first_name} {profileData?.middle_name}{' '}
              {profileData?.last_name}
            </h3>
            <p className='text-muted-foreground text-sm'>
              {profileData?.email}
            </p>
          </div>
        </div>

        {/* Form */}
        <form key={formKey} onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 items-center gap-4'>
            {/* Title */}
            <div className='flex flex-col items-start space-y-1.5'>
              <Label htmlFor='title'>Title</Label>
              <Select
                defaultValue={profileData?.title ?? ''}
                onValueChange={(val) => handleChange('title', val)}
                disabled={isLoading || isEditing}
              >
                <SelectTrigger id='title'>
                  <SelectValue placeholder='Select title' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='MR'>Mr</SelectItem>
                  <SelectItem value='MS'>Ms</SelectItem>
                  <SelectItem value='MRS'>Mrs</SelectItem>
                  <SelectItem value='MISS'>Miss</SelectItem>
                  <SelectItem value='DR'>Dr</SelectItem>
                  <SelectItem value='PROFESSOR'>Professor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* First Name */}
            <div className='flex flex-col items-start space-y-1.5'>
              <Label htmlFor='first_name'>First Name</Label>
              <Input
                type='text'
                id='first_name'
                defaultValue={profileData?.first_name ?? ''}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder='First Name'
                disabled={isLoading || isEditing}
              />
            </div>

            {/* Middle Name */}
            <div className='flex flex-col items-start space-y-1.5'>
              <Label htmlFor='middle_name'>Middle Name</Label>
              <Input
                type='text'
                id='middle_name'
                defaultValue={profileData?.middle_name ?? ''}
                onChange={(e) => handleChange('middle_name', e.target.value)}
                placeholder='Middle Name'
                disabled={isLoading || isEditing}
              />
            </div>

            {/* Last Name */}
            <div className='flex flex-col items-start space-y-1.5'>
              <Label htmlFor='last_name'>Last Name</Label>
              <Input
                type='text'
                id='last_name'
                defaultValue={profileData?.last_name ?? ''}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder='Last Name'
                disabled={isLoading || isEditing}
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <Button type='submit' disabled={isEditing}>
              {isEditing ? (
                'Saving...'
              ) : (
                <>
                  <Pencil className='mr-1 size-4' />
                  Save Changes
                </>
              )}
            </Button>
            <Button type='button' variant='danger'>
              <Lock className='mr-1 size-4' />
              Reset Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
