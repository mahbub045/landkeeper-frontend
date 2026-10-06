'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useDeleteLandlordMutation } from '@/store/api/endpoints/super-admin/Landlords/Overview/OverviewApi';
import { DeleteLandlordProps } from '@/types/super-admin/Landlords/Overview/OverviewType';
import {
  AlertTriangle,
  Building2,
  FileText,
  Trash2,
  UserX,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: UserX, label: 'Account' },
  { icon: Building2, label: 'Properties' },
  { icon: Users, label: 'Tenants' },
  { icon: FileText, label: 'Documents' },
];

const DeleteLandlord: React.FC<DeleteLandlordProps> = ({
  landlord,
  landlord_alias,
  fullName,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteLandlord, { isLoading }] = useDeleteLandlordMutation();

  async function handleDelete() {
    try {
      await deleteLandlord({ landlord_alias }).unwrap();
      toast.success('Landlord deleted successfully.');
      setOpen(false);
      router.push('/super-admin/landlords');
    } catch {
      toast.error('Failed to delete landlord. Please try again.');
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4 rounded-xl border border-red-500/30 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'>
            <AlertTriangle className='size-5' />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-red-600 dark:text-red-400'>
              Delete Landlord
            </h3>
            <p className='text-muted-foreground mt-0.5 text-sm'>
              Permanently remove this landlord and all of their data. This
              action cannot be undone.
            </p>
          </div>
        </div>

        <Button
          type='button'
          variant='destructive'
          onClick={() => setOpen(true)}
          className='shrink-0'
        >
          <Trash2 className='size-4' />
          Delete Landlord
        </Button>
      </div>

      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title='Delete this landlord?'
        targetLabel='Landlord'
        targetName={fullName}
        targetSubtext={landlord.email}
        targetIcon={UserX}
        impactItems={IMPACT_ITEMS}
        confirmText={landlord.email}
        cancelLabel='Keep Landlord'
        confirmLabel='Delete Landlord'
      />
    </>
  );
};

export default DeleteLandlord;
