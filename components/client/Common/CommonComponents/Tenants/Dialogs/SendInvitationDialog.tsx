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
import { useSendInvitationMutation } from '@/store/api/endpoints/client/Common/Tenants/TenantsApi';
import { SendInvitationDialogProps } from '@/types/client/Common/Tenants/TenantsTypes';
import { toast } from 'sonner';

const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({
  open,
  onClose,
  tenantData,
}) => {
  const [sendInvitation, { isLoading }] = useSendInvitationMutation();

  const handleSend = async () => {
    try {
      await sendInvitation({
        tenant_alias: tenantData?.alias,
      }).unwrap();
      toast.success('Invitation sent successfully');

      onClose();
    } catch (err) {
      toast.error('Failed to send invitation. Please try again.');
      //   console.error('Failed to send invitation:', err);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Invitation</DialogTitle>
          <DialogDescription>
            Send an invitation to join{' '}
            <span className='text-primary font-semibold'>
              {tenantData?.title ?? ''}{' '}
              {tenantData?.first_name ?? 'this tenant'}{' '}
              {tenantData?.middle_name ?? ''} {tenantData?.last_name ?? ''}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2 py-2'>
          <Label htmlFor='invite-email'>Email address</Label>
          <Input
            id='invite-email'
            type='email'
            placeholder='user@example.com'
            value={tenantData?.email || ''}
            disabled={isLoading || !!tenantData?.email}
          />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading && <Loading className='text-white!' />}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvitationDialog;
