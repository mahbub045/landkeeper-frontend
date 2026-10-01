'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PLAN_STYLES } from '@/data/super-admin/Landlords/LandlordData';
import { cn } from '@/lib/utils';
import { useEditLandlordMutation } from '@/store/api/endpoints/super-admin/Landlords/Overview/OverviewApi';
import {
  LandlordProps,
  ProfileHeaderProps,
} from '@/types/super-admin/Landlords/Overview/OverviewType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { Camera, Crown, Mail } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

/** Also used by AccountDetails */
export const SubscriptionBadge: React.FC<LandlordProps> = ({ landlord }) => {
  if (landlord.subscription_status)
    return (
      <Badge
        variant={
          landlord.subscription_status === 'ACTIVE'
            ? 'successLight'
            : 'warningLight'
        }
      >
        {formatChoiceFieldValue(landlord.subscription_status)}
      </Badge>
    );
  if (landlord.trial_days_left != null)
    return (
      <Badge variant='infoLight'>
        {landlord.trial_days_left} trial days left
      </Badge>
    );
  return <Badge variant='dangerLight'>Unsubscribed</Badge>;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  landlord,
  landlord_uid,
  fullName,
}) => {
  const initials =
    `${landlord.first_name?.[0] ?? ''}${landlord.last_name?.[0] ?? ''}`.toUpperCase();
  const hasPlan = landlord.has_subscription && Boolean(landlord.plan);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editLandlord, { isLoading: isUploading }] = useEditLandlordMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const body = new FormData();
      body.append('profile_image', file);
      await editLandlord({ landlord_uid, data: body }).unwrap();
      toast.success('Profile picture updated.');
    } catch {
      toast.error('Failed to upload image. Please try again.');
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const avatarSrc = previewUrl ?? landlord.profile_image ?? undefined;

  return (
    <Card className='from-primary/10 via-card to-card relative gap-0 bg-linear-to-br p-5 sm:p-6'>
      <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 items-center gap-4'>
          <div className='relative shrink-0'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label='Change profile picture'
              className='group/avatar relative block cursor-pointer rounded-full disabled:cursor-not-allowed'
            >
              <Avatar className='ring-background size-16 ring-4 sm:size-20'>
                {avatarSrc && <AvatarImage src={avatarSrc} alt={fullName} />}
                <AvatarFallback className='bg-primary text-primary-foreground text-xl font-semibold'>
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>

              {/* Hover / uploading overlay */}
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity',
                  isUploading
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/avatar:opacity-100',
                )}
              >
                {isUploading ? (
                  <span className='size-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                ) : (
                  <Camera className='size-5' />
                )}
              </span>

              {/* Always-visible camera badge (for touch devices) */}
              <span className='bg-muted text-primary ring-card absolute right-0 bottom-1 flex size-6 items-center justify-center rounded-full ring-2'>
                <Camera className='size-3' />
              </span>
            </button>

            <span
              className={cn(
                'ring-card absolute top-1 right-1 size-3.5 rounded-full ring-2',
                landlord.is_active ? 'bg-emerald-500' : 'bg-red-500',
              )}
            />

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />
          </div>

          <div className='min-w-0'>
            <h2 className='truncate text-xl font-semibold tracking-tight'>
              {fullName}
            </h2>
            <p className='text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-sm'>
              <Mail className='size-3.5 shrink-0' />
              {landlord.email}
            </p>
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              <Badge
                variant={landlord.is_active ? 'successLight' : 'dangerLight'}
              >
                {landlord.is_active ? 'Account Active' : 'Account Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Current plan panel */}
        <div className='bg-card/70 ring-foreground/10 flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm ring-1 backdrop-blur-sm sm:min-w-56'>
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-lg',
              hasPlan
                ? PLAN_STYLES[landlord.plan!]
                : 'bg-muted text-muted-foreground',
            )}
          >
            <Crown className='size-5' />
          </div>

          <div className='min-w-0 flex-1'>
            <p className='text-muted-foreground text-[11px] font-medium tracking-wider uppercase'>
              Current Plan
            </p>
            <p className='truncate text-base leading-tight font-semibold'>
              {hasPlan
                ? `${formatChoiceFieldValue(landlord.plan)} Plan`
                : 'No active plan'}
            </p>
            <div className='mt-1.5'>
              <SubscriptionBadge landlord={landlord} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
