import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { avatarColors } from '@/data/client/common/tenant/TenantData';
import { TenantRowProps } from '@/types/client/Common/Tenant/TenantTypes';
import { formatDate, getCurrencySign, getInitials } from '@/utils/formatters';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import DeleteTenantDialog from '../Dialogs/DeleteTenantDialog';
import UpdateTenantDialog from '../Dialogs/UpdateTenantDialog';
import ViewTenantDialog from '../Dialogs/ViewTenantDialog';

function avatarColor(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

const TenantRow: React.FC<TenantRowProps> = ({ tenant, apiTenant, idx }) => {
  const { data: session } = useSession();
  const isActive = tenant.status === 'Active';
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
        <TableCell className='text-muted-foreground flex justify-start pl-15 text-sm'>
          {tenant.property}
        </TableCell>
        <TableCell className='text-foreground text-sm font-bold'>
          {getCurrencySign()}
          {tenant.rent.toLocaleString('en-GB')}
        </TableCell>
        <TableCell className='text-muted-foreground text-sm'>
          {formatDate(tenant.startDate)}
        </TableCell>
        <TableCell className='text-muted-foreground text-sm'>
          {formatDate(tenant.endDate)}
        </TableCell>
        <TableCell>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-warning'}`}
            />
            {tenant.status}
          </Badge>
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center gap-2'>
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
