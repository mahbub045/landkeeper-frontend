'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ViewTenantDialogProps } from '@/types/client/Common/Tenant/TenantTypes';
import { getCurrencySign } from '@/utils/formatters';
import { User } from 'lucide-react';

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className='text-muted-foreground text-xs font-semibold'>{label}</p>
      <p className='text-foreground text-sm'>{value || '—'}</p>
    </div>
  );
}

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const ViewTenantDialog: React.FC<ViewTenantDialogProps> = ({
  open,
  onClose,
  tenant,
}) => {
  if (!tenant) return null;

  const isActive = tenant.tenancy_end_date
    ? new Date(tenant.tenancy_end_date) >= new Date()
    : true;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Tenant Details
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
          {/* Avatar + name + status */}
          <div className='flex flex-col items-center gap-3'>
            <Avatar className='h-24 w-24 border-2'>
              <AvatarImage
                src={tenant.avatar ?? undefined}
                alt={`${tenant.first_name} ${tenant.last_name}`}
              />
              <AvatarFallback className='bg-muted'>
                <User className='text-muted-foreground h-8 w-8' />
              </AvatarFallback>
            </Avatar>
            <div className='text-center'>
              <p className='text-foreground text-lg font-bold'>
                {tenant.first_name} {tenant.last_name}
              </p>
              <p className='text-muted-foreground text-sm'>{tenant.email}</p>
            </div>
            <Badge
              className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${
                isActive
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }`}
            >
              <span
                className={`inline-block size-1.5 rounded-full ${
                  isActive ? 'bg-success' : 'bg-warning'
                }`}
              />
              {isActive ? 'Active' : 'Ended'}
            </Badge>
          </div>

          {/* Property */}
          <div className='bg-muted/50 rounded-lg border px-4 py-3'>
            <p className='text-muted-foreground text-xs font-semibold'>
              Property
            </p>
            <p className='text-foreground text-sm font-semibold'>
              {tenant.property?.property_name || '—'}
            </p>
          </div>

          {/* Contact */}
          <div className='grid grid-cols-2 gap-4'>
            <InfoRow label='Email' value={tenant.email} />
            <InfoRow label='Phone' value={tenant.phone} />
          </div>

          {/* Financials */}
          <div className='grid grid-cols-2 gap-4'>
            <InfoRow
              label='Rent Amount'
              value={
                tenant.rent_amount
                  ? `${getCurrencySign()}${Number(tenant.rent_amount).toLocaleString('en-GB')} / month`
                  : undefined
              }
            />
            <InfoRow
              label='Deposit'
              value={
                tenant.deposit
                  ? `${getCurrencySign()}${Number(tenant.deposit).toLocaleString('en-GB')}`
                  : undefined
              }
            />
          </div>

          {/* Tenancy dates */}
          <div className='grid grid-cols-2 gap-4'>
            <InfoRow
              label='Tenancy Start'
              value={formatDate(tenant.tenancy_start_date)}
            />
            <InfoRow
              label='Tenancy End'
              value={formatDate(tenant.tenancy_end_date)}
            />
          </div>

          {/* Employment + Guarantor */}
          <div className='grid grid-cols-2 gap-4'>
            <InfoRow
              label='Employment Details'
              value={tenant.employment_details}
            />
            <InfoRow label='Guarantor Name' value={tenant.guarantor_name} />
          </div>

          {/* Notes */}
          <InfoRow label='Notes' value={tenant.notes} />
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTenantDialog;
