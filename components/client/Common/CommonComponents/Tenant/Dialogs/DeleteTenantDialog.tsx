'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteTenantMutation } from '@/store/api/endpoints/client/Common/Tenant/TenantApi';
import { DeleteTenantDialogProps } from '@/types/client/Common/Tenant/TenantTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteTenantDialog: React.FC<DeleteTenantDialogProps> = ({
  open,
  onClose,
  onSuccess,
  tenantData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTenant] = useDeleteTenantMutation();

  const fullName = [
    formatChoiceFieldValue(tenantData?.title),
    tenantData?.first_name,
    tenantData?.middle_name,
    tenantData?.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteTenant({ tenant_alias: tenantData?.alias }).unwrap();
      toast.success('Tenant deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      setError('Failed to delete tenant. Please try again.');
      toast.error('Failed to delete tenant. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='w-full gap-0 p-0 sm:max-w-md'>
        <DialogHeader className='items-center px-6 pt-8 pb-2 text-center'>
          <div className='bg-danger/10 mb-4 flex size-14 items-center justify-center rounded-full'>
            <AlertTriangle className='text-danger size-7' />
          </div>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Delete Tenant
          </DialogTitle>
          <DialogDescription className='text-muted-foreground mt-1 text-sm'>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 py-5'>
          {error && (
            <div className='border-danger/30 bg-danger/10 text-danger mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm'>
              <X className='mt-0.5 size-4 shrink-0' />
              <span>{error}</span>
            </div>
          )}

          <div className='bg-danger/10 rounded-lg border px-4 py-3 text-center'>
            <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              You are about to delete
            </p>
            <p className='text-danger mt-1 font-semibold'>
              {fullName || 'this tenant'}
            </p>
            <small className='text-danger/80'>{`(${tenantData?.email})`}</small>
          </div>

          <p className='text-muted-foreground mt-4 text-center text-sm'>
            This will permanently remove the tenant and all associated data,
            including lease history and documents.
          </p>
        </div>

        <div className='bg-muted/30 flex items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={handleDelete}
            disabled={loading}
            className='gap-2'
          >
            {loading ? (
              <Loading className='text-white!' />
            ) : (
              <Trash2 className='size-4' />
            )}
            Delete Tenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTenantDialog;
