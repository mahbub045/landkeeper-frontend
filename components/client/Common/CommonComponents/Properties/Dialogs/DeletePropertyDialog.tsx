'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeletePropertyMutation } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import { DeletePropertyDialogProps } from '@/types/client/Common/Properties/PropertyTypes';
import { Building2, Database, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: Users, label: 'Tenants' },
  { icon: FileText, label: 'Documents' },
  { icon: Database, label: 'Related data' },
];

const DeletePropertyDialog: React.FC<DeletePropertyDialogProps> = ({
  open,
  onClose,
  onSuccess,
  propertyAlias,
  propertyName,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteProperty] = useDeletePropertyMutation();

  async function handleDelete() {
    setLoading(true);

    try {
      await deleteProperty({ property_alias: propertyAlias }).unwrap();

      toast.success('Property deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete property. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={loading}
      title='Delete this property?'
      targetLabel='Property to delete'
      targetName={propertyName}
      targetIcon={Building2}
      impactItems={IMPACT_ITEMS}
      confirmText='DELETE'
      cancelLabel='Keep Property'
      confirmLabel='Delete Property'
    />
  );
};

export default DeletePropertyDialog;
