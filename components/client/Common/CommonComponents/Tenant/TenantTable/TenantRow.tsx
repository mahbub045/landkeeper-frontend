import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { avatarColors } from '@/data/client/common/tenant/TenantData';
import { useUpdateTenantMutation } from '@/store/api/endpoints/client/Common/Tenant/TenantApi';
import { TenantRowProps } from '@/types/client/Common/Tenant/TenantTypes';
import { formatDate, getCurrencySign, getInitials } from '@/utils/formatters';
import { Eye, Pencil, Send, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteTenantDialog from '../Dialogs/DeleteTenantDialog';
import SendInvitationDialog from '../Dialogs/SendInvitationDialog';
import UpdateTenantDialog from '../Dialogs/UpdateTenantDialog';
import ViewTenantDialog from '../Dialogs/ViewTenantDialog';

function avatarColor(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

const TenantRow: React.FC<TenantRowProps> = ({ tenant, apiTenant, idx }) => {
  const { data: session } = useSession();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sentInvitation, setSentInvitation] = useState(false);
  const [updateTenant, { isLoading: isUpdatingStatus }] =
    useUpdateTenantMutation();

  const handleStatusChange = async (value: string) => {
    const updatedTenant = {
      is_active: value === 'active',
    };
    try {
      await updateTenant({
        tenant_alias: tenant.alias,
        payload: updatedTenant,
      });
      toast.success(
        `Tenant status updated to ${value === 'active' ? 'Active' : 'Deactivated'}`,
      );
    } catch (error) {
      console.error('Error updating tenant status:', error);
      toast.error('Failed to update tenant status');
    }
  };

  return (
    <>
      <TableRow className='text-center'>
        <TableCell>
          <div className='flex items-center justify-start gap-3 pl-10'>
            <Avatar className='size-9 shrink-0'>
              <AvatarImage
                src={apiTenant.avatar || ''}
                alt={tenant.first_name}
              />
              <AvatarFallback
                className={`text-xs font-bold ${avatarColor(idx)}`}
              >
                {getInitials(tenant.first_name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start justify-center'>
              <p className='text-foreground text-sm font-semibold'>
                {`${tenant.title} ${tenant.first_name} ${tenant.middle_name} ${tenant.last_name}`.trim()}
              </p>
              <p className='text-muted-foreground text-xs'>{tenant.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className='flex justify-start pl-15 text-sm'>
          {tenant.property ? (
            <p className='text-foreground text-sm font-semibold'>
              {tenant.property}
            </p>
          ) : (
            <small className='text-muted-foreground'>Not Available</small>
          )}
        </TableCell>
        <TableCell className='text-sm font-bold'>
          {apiTenant.rent_amount ? (
            <>
              {getCurrencySign()} <span> {apiTenant.rent_amount}</span>
            </>
          ) : (
            <small className='text-muted-foreground'>
              {getCurrencySign()} 0
            </small>
          )}
        </TableCell>
        <TableCell className='text-sm'>
          {tenant.startDate ? (
            formatDate(tenant.startDate)
          ) : (
            <small className='text-muted-foreground'>Not Available</small>
          )}
        </TableCell>
        <TableCell className='text-sm'>
          {tenant.endDate ? (
            formatDate(tenant.endDate)
          ) : (
            <small className='text-muted-foreground'>Not Available</small>
          )}
        </TableCell>

        <TableCell className='flex items-center justify-center'>
          {tenant.is_password_set ? (
            <Select
              value={tenant.is_active ? 'active' : 'deactivated'}
              onValueChange={(value) => handleStatusChange(value)}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger
                size='sm'
                className={`h-6! w-fit gap-1.5 border px-2 py-1.5 text-xs font-semibold hover:bg-inherit ${tenant.is_active ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'}`}
              >
                <span
                  className={`inline-block size-1.5 rounded-full ${tenant.is_active ? 'bg-success' : 'bg-danger'}`}
                />
                <SelectValue>
                  {tenant.is_active ? 'Active' : 'Deactivated'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active' className='focus:bg-success/10'>
                  <span className='bg-success inline-block size-1.5 rounded-full' />
                  Active
                </SelectItem>
                <SelectItem value='deactivated' className='focus:bg-danger/10'>
                  <span className='bg-danger inline-block size-1.5 rounded-full' />
                  Deactivated
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant='destructive' className='ps-3 text-xs'>
              <span>Deactivated</span>
              <HoverInfoPopover
                triggerClassName='flex size-4 items-center justify-center'
                content='Tenant has not set their password yet'
              />
            </Badge>
          )}
        </TableCell>
        <TableCell className='text-sm'>
          {tenant.created_at ? (
            formatDate(tenant.created_at)
          ) : (
            <small className='text-muted-foreground'>Not Available</small>
          )}
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='success'
              size='icon'
              title='Send Invitation'
              className='rounded-lg'
              onClick={() => setSentInvitation(true)}
            >
              <Send />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              title='View Tenant Details'
              className='rounded-lg'
              onClick={() => setViewOpen(true)}
            >
              <Eye />
            </Button>
            <Button
              variant='default'
              size='icon'
              title='Edit Tenant Details'
              className='rounded-lg'
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            {session?.user?.role === 'LANDLORD' && (
              <Button
                variant='danger'
                size='icon'
                title='Delete Tenant'
                className='rounded-lg'
                onClick={() => setDeleteOpen(true)}
              >
                <Trash />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <SendInvitationDialog
        open={sentInvitation}
        onClose={() => setSentInvitation(false)}
        tenantData={apiTenant}
      />

      <UpdateTenantDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        tenant={apiTenant}
      />

      <DeleteTenantDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => setDeleteOpen(false)}
        tenantData={apiTenant}
      />

      <ViewTenantDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        tenant={apiTenant}
      />
    </>
  );
};

export default TenantRow;
