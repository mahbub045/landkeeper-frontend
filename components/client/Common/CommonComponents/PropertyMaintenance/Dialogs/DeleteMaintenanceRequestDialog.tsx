'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeletePropertyMaintenanceMutation } from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import { DeleteMaintenanceRequestDialogProps } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import { FileText, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: Wrench, label: 'Request' },
  { icon: FileText, label: 'Documents' },
];

const DeleteMaintenanceRequestDialog: React.FC<
  DeleteMaintenanceRequestDialogProps
> = ({ isOpen, onClose, maintenanceRequestAlias, maintenanceRequestId }) => {
  const router = useRouter();
  const [deleteMaintenanceRequest, { isLoading }] =
    useDeletePropertyMaintenanceMutation();

  const handleDelete = async () => {
    if (!maintenanceRequestAlias || isLoading) return;

    try {
      await deleteMaintenanceRequest(maintenanceRequestAlias).unwrap();

      toast.success('Maintenance request deleted successfully.');
      onClose();
      router.back();
    } catch {
      toast.error('Failed to delete maintenance request.');
    }
  };

  return (
    <DeleteConfirmDialog
      open={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this request?'
      targetLabel='Maintenance request'
      targetName={maintenanceRequestId}
      targetIcon={Wrench}
      impactItems={IMPACT_ITEMS}
      cancelLabel='Keep Request'
      confirmLabel={isLoading ? 'Deleting...' : 'Delete Request'}
    />
  );
};

export default DeleteMaintenanceRequestDialog;
