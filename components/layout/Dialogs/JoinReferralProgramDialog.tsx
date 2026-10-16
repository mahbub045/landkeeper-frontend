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
import { useJoinReferralProgramMutation } from '@/store/api/endpoints/common/SystemUserJoinReferralProgram/SystemUserJoinReferralProgramApi';
import { JoinReferralProgramDialogProps } from '@/types/common/ReferralProgram/JoinReferralProgramTypes';
import { BadgePercent, Gift, Wallet } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const BENEFITS = [
  {
    icon: BadgePercent,
    title: 'They subscribe',
    description: 'Your referrals sign up for a Landkeeper plan.',
  },
  {
    icon: Wallet,
    title: 'You earn rewards',
    description: 'Get rewarded for every successful referral.',
  },
];

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (typeof obj.detail === 'string') return obj.detail;
      if (typeof obj.message === 'string') return obj.message;
      if (typeof obj.error === 'string') return obj.error;
    }
    if (typeof data === 'string') return data;
  }
  return 'Failed to join the referral program';
}

const JoinReferralProgramDialog: React.FC<JoinReferralProgramDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [joinReferralProgram, { isLoading }] = useJoinReferralProgramMutation();

  const handleJoin = async () => {
    try {
      await joinReferralProgram(undefined).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error));
      return;
    }

    try {
      await update();
    } catch (error) {
      console.error('Failed to sync session after joining referral:', error);
    }

    toast.success('Welcome to the referral program!');
    onClose();

    window.location.href = `${process.env.NEXT_PUBLIC_REFERRAL_DASHBOARD_URL}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && !isLoading && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <div className='bg-primary/10 mb-2 flex h-14 w-14 items-center justify-center rounded-full'>
            <Gift className='text-primary h-7 w-7' />
          </div>
          <DialogTitle className='text-xl'>
            Join Our Referral Program
          </DialogTitle>
          <DialogDescription className='text-center'>
            Refer landlords to Landkeeper and earn rewards when they subscribe.
          </DialogDescription>
        </DialogHeader>

        <ul className='space-y-3 py-2'>
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className='flex items-start gap-3 rounded-lg border p-3'
            >
              <div className='bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md'>
                <Icon className='text-primary h-4 w-4' />
              </div>
              <div>
                <p className='text-sm font-medium'>{title}</p>
                <p className='text-muted-foreground text-xs'>{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <DialogFooter className='gap-2 sm:gap-2'>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={isLoading}>
            {isLoading ? <Loading className='text-white!' /> : <Gift />}
            Join Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinReferralProgramDialog;
