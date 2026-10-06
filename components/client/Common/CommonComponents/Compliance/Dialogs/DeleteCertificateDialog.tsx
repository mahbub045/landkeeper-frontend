'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteComplianceMutation } from '@/store/api/endpoints/client/Common/Compliance/ComplianceApi';
import { DeleteCertificateDialogProps } from '@/types/client/Common/Compliance/ComplianceTypes';
import { ClipboardList, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: ShieldCheck, label: 'Certificate' },
  { icon: ClipboardList, label: 'Compliance records' },
];

const DeleteCertificateDialog: React.FC<DeleteCertificateDialogProps> = ({
  open,
  onClose,
  onSuccess,
  certificateAlias,
}) => {
  const [deleteCertificate, { isLoading }] = useDeleteComplianceMutation();

  async function handleDelete() {
    try {
      await deleteCertificate({
        compliance_alias: certificateAlias,
      }).unwrap();

      toast.success('Certificate deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete certificate. Please try again.');
    }
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this certificate?'
      impactItems={IMPACT_ITEMS}
      impactNote='Please make sure this certificate is no longer required before continuing.'
      cancelLabel='Keep Certificate'
      confirmLabel='Delete Certificate'
    />
  );
};

export default DeleteCertificateDialog;
