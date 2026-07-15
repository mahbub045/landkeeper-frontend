import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { avatarColors } from '@/data/client/common/tenant/TenantData';
import { TenantRowProps } from '@/types/client/Common/Tenant/TenantTypes';
import {
  formatChoiceFieldValue,
  formatDate,
  getCurrencySign,
  getInitials,
} from '@/utils/formatters';
import { Eye, Pencil, Send, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
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

  return (
    <>
      <TableRow className='text-center'>
        <TableCell>
          <div className='flex items-center justify-start gap-3 pl-10'>
            <Avatar className='size-9 shrink-0'>
              <AvatarImage src={apiTenant.avatar || ''} alt={tenant.name} />
              <AvatarFallback
                className={`text-xs font-bold ${avatarColor(idx)}`}
              >
                {getInitials(tenant.name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start justify-center'>
              <p className='text-foreground text-sm font-semibold'>
                {tenant.name}
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
          {tenant.rent ? (
            <>
              {getCurrencySign()} <span> tenant.rent.toLocaleString()</span>
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
        <TableCell>
          <Badge
            className={`text-xs ${tenant.is_active ? 'bg-success' : 'bg-danger'}`}
          >
            {formatChoiceFieldValue(tenant.is_active ? 'Active' : 'Inactive')}
          </Badge>
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='success'
              size='icon'
              className='rounded-lg'
              onClick={() => setSentInvitation(true)}
            >
              <Send />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              className='rounded-lg'
              onClick={() => setViewOpen(true)}
            >
              <Eye />
            </Button>
            <Button
              variant='default'
              size='icon'
              className='rounded-lg'
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            {session?.user?.role === 'LANDLORD' && (
              <Button
                variant='danger'
                size='icon'
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
        tenantAlias={tenant.alias}
        tenantName={tenant.name}
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
