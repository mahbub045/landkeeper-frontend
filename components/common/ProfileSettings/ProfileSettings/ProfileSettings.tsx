'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import {
  useEditProfileInfoMutation,
  useGetProfileInfoQuery,
} from '@/store/api/endpoints/common/ProfileSettings/ProfileApi';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Camera, KeyRound, Pencil, ShieldCheck } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import Loading from '../../CustomLoader/Loading';
import UpdatePasswordDialog from './Dialogs/UpdatePasswordDialog';

const ProfileSettings: React.FC = () => {
  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);
  const [editProfileInfo, { isLoading: isEditing }] =
    useEditProfileInfoMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false);

  const initialFormData = useMemo(
    () => ({
      title: profileData?.title ?? '',
      first_name: profileData?.first_name ?? '',
      middle_name: profileData?.middle_name ?? '',
      last_name: profileData?.last_name ?? '',
      phone: profileData?.phone ?? '',
      current_address: profileData?.current_address ?? '',
      ni_number: profileData?.ni_number ?? '',
      utr_number: profileData?.utr_number ?? '',
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

  const avatarSrc = previewUrl ?? profileData?.profile_image ?? undefined;

  const fullName = [
    formatChoiceFieldValue(profileData?.title),
    profileData?.first_name,
    profileData?.middle_name,
    profileData?.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  if (isLoading) {
    return (
      <div className='flex h-[70vh] items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className='mx-auto w-full py-5'>
        {/* Page header */}
        <div className='mb-5'>
          <h1 className='text-foreground text-xl font-semibold tracking-tight'>
            Profile Settings
          </h1>
          <p className='text-muted-foreground mt-0.5 text-sm'>
            Manage your personal details, contact information, and account
            security.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 gap-4 lg:grid-cols-3'
        >
          {/* Main column */}
          <div className='space-y-4 lg:col-span-2'>
            <Card className='gap-0 pt-0 pb-0'>
              <CardHeader className='border-b py-3'>
                <h2 className='text-foreground text-sm font-semibold'>
                  Personal Information, Tax & Identification
                </h2>
                <p className='text-muted-foreground text-xs'>
                  Your name as it will appear across the platform.
                </p>
              </CardHeader>
              <CardContent className='space-y-3 py-4'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='title'>
                      Title<span className='text-danger'>*</span>
                    </Label>
                    <Select
                      defaultValue={profileData?.title ?? ''}
                      onValueChange={(val) => handleChange('title', val)}
                      disabled={isEditing}
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
                  </div>

                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='first_name'>
                      First Name<span className='text-danger'>*</span>
                    </Label>
                    <Input
                      type='text'
                      id='first_name'
                      defaultValue={profileData?.first_name ?? ''}
                      onChange={(e) =>
                        handleChange('first_name', e.target.value)
                      }
                      placeholder='First Name'
                      disabled={isEditing}
                      required
                    />
                  </div>

                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='last_name'>
                      Last Name<span className='text-danger'>*</span>
                    </Label>
                    <Input
                      type='text'
                      id='last_name'
                      defaultValue={profileData?.last_name ?? ''}
                      onChange={(e) =>
                        handleChange('last_name', e.target.value)
                      }
                      placeholder='Last Name'
                      disabled={isEditing}
                      required
                    />
                  </div>

                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='middle_name'>Middle Name</Label>
                    <Input
                      type='text'
                      id='middle_name'
                      defaultValue={profileData?.middle_name ?? ''}
                      onChange={(e) =>
                        handleChange('middle_name', e.target.value)
                      }
                      placeholder='Middle Name'
                      disabled={isEditing}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='phone'>Phone</Label>
                    <Input
                      type='text'
                      id='phone'
                      defaultValue={profileData?.phone ?? ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder='Phone'
                      disabled={isEditing}
                    />
                  </div>
                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      type='text'
                      id='email'
                      value={profileData?.email ?? ''}
                      placeholder='Email'
                      disabled
                    />
                  </div>
                </div>
                <div className='flex flex-col items-start space-y-1'>
                  <Label htmlFor='current_address'>Current Address</Label>
                  <Input
                    type='text'
                    id='current_address'
                    defaultValue={profileData?.current_address ?? ''}
                    onChange={(e) =>
                      handleChange('current_address', e.target.value)
                    }
                    placeholder='Current Address'
                    disabled={isEditing}
                  />
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='ni_number'>NI Number</Label>
                    <Input
                      type='text'
                      id='ni_number'
                      defaultValue={profileData?.ni_number ?? ''}
                      onChange={(e) =>
                        handleChange('ni_number', e.target.value)
                      }
                      placeholder='NI Number'
                      disabled={isEditing}
                    />
                  </div>
                  <div className='flex flex-col items-start space-y-1'>
                    <Label htmlFor='utr_number'>UTR Number</Label>
                    <Input
                      type='text'
                      id='utr_number'
                      defaultValue={profileData?.utr_number ?? ''}
                      onChange={(e) =>
                        handleChange('utr_number', e.target.value)
                      }
                      placeholder='UTR Number'
                      disabled={isEditing}
                    />
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button type='submit' disabled={isEditing}>
                    {isEditing ? (
                      <Loading className='text-white!' />
                    ) : (
                      <Pencil />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-4'>
            <Card className='gap-0 py-4'>
              <CardContent className='flex flex-col items-center gap-2.5 text-center'>
                <div className='relative'>
                  <Avatar size='default' className='size-30'>
                    <AvatarImage src={avatarSrc} alt='Profile' />
                    <AvatarFallback className='text-lg'>
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
                    className='bg-primary text-primary-foreground absolute right-0 bottom-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {isUploadingImage ? (
                      <span className='size-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    ) : (
                      <Camera className='size-3.5' />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className='text-foreground text-sm font-semibold'>
                    {fullName || 'Your Name'}
                  </h3>
                  <p className='text-muted-foreground text-xs'>
                    {profileData?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='gap-0 py-4'>
              <CardHeader className='flex flex-col items-center gap-2 pb-2!'>
                <ShieldCheck className='text-destructive size-16' />
                <h2 className='text-foreground text-sm font-semibold'>
                  Security
                </h2>
              </CardHeader>
              <CardContent className='space-y-2.5'>
                <p className='text-muted-foreground text-center text-xs'>
                  {profileData?.is_password_available
                    ? 'Keep your account secure by updating your password regularly. Use a mix of letters, numbers, and symbols, and avoid reusing passwords from other sites.'
                    : "You haven't set a password yet. Set one to enable email sign-in as a backup to your current login method."}
                </p>
                <ul className='text-muted-foreground space-y-1 text-xs'>
                  <li className='flex items-start gap-1.5'>
                    <span className='mt-1 size-1 shrink-0 rounded-full bg-current' />
                    Choose a password you haven&apos;t used before
                  </li>
                  <li className='flex items-start gap-1.5'>
                    <span className='mt-1 size-1 shrink-0 rounded-full bg-current' />
                    Update it every few months for best practice
                  </li>
                  <li className='flex items-start gap-1.5'>
                    <span className='mt-1 size-1 shrink-0 rounded-full bg-current' />
                    Never share your password with anyone
                  </li>
                </ul>
                <Button
                  type='button'
                  variant='destructive'
                  className='w-full'
                  onClick={() => setIsUpdatePasswordDialogOpen(true)}
                >
                  <KeyRound />
                  {profileData?.is_password_available
                    ? 'Change Password'
                    : 'Set Password'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>

      <UpdatePasswordDialog
        open={isUpdatePasswordDialogOpen}
        onClose={() => setIsUpdatePasswordDialogOpen(false)}
        profileData={profileData}
      />
    </>
  );
};

export default ProfileSettings;
