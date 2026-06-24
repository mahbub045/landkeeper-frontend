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
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const ProfileSettings: React.FC = () => {
  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);
  const [editProfileInfo, { isLoading: isEditing }] =
    useEditProfileInfoMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const initialFormData = useMemo(
    () => ({
      title: profileData?.title ?? '',
      first_name: profileData?.first_name ?? '',
      middle_name: profileData?.middle_name ?? '',
      last_name: profileData?.last_name ?? '',
      phone: profileData?.phone ?? '',
    }),
    [profileData],
  );

  const [formData, setFormData] = useState(initialFormData);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploadingImage(true);

    try {
      const body = new FormData();
      body.append('profile_image', file);
      await editProfileInfo(body).unwrap();
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const formKey = isLoading ? 'loading' : 'loaded';
  const avatarSrc = previewUrl ?? profileData?.profile_image ?? undefined;

  return (
    <Card className='pt-0'>
      <CardContent className='space-y-5 p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-foreground text-sm font-semibold'>
            Profile Settings
          </h2>
        </div>

        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Avatar size='default' className='size-16'>
              <AvatarImage src={avatarSrc} alt='Profile' />
              <AvatarFallback>
                {getInitials(profileData?.first_name) ?? 'U'}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />

            <button
              type='button'
              onClick={handleAvatarClick}
              disabled={isUploadingImage}
              aria-label='Change profile picture'
              className='bg-primary text-primary-foreground absolute right-0 bottom-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isUploadingImage ? (
                <span className='size-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
              ) : (
                <Camera className='size-4' />
              )}
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

        <form key={formKey} onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 items-center gap-4'>
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
          <div className='flex flex-col items-start space-y-1.5'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              type='text'
              id='phone'
              defaultValue={profileData?.phone ?? ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder='Phone'
              disabled={isLoading || isEditing}
            />
          </div>

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
