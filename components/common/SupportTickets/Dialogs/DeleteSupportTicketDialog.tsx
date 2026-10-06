'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteSupportTicketsMutation } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import { DeleteSupportTicketDialogProps } from '@/types/common/SupportTickets/SupportTicketTypes';
import { History, MessageSquare, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: MessageSquare, label: 'Messages' },
  { icon: Paperclip, label: 'Attachments' },
  { icon: History, label: 'History' },
];

const DeleteSupportTicketDialog: React.FC<DeleteSupportTicketDialogProps> = ({
  open,
  onClose,
  onSuccess,
  ticketAlias,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteTicket] = useDeleteSupportTicketsMutation();

  async function handleDelete() {
    setLoading(true);

    try {
      await deleteTicket({ ticket_alias: ticketAlias }).unwrap();

      toast.success('Ticket deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete ticket. Please try again.');
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
      title='Delete this ticket?'
      impactItems={IMPACT_ITEMS}
      impactNote='Please make sure you no longer need this ticket before continuing.'
      cancelLabel='Keep Ticket'
      confirmLabel='Delete Ticket'
    />
  );
};

export default DeleteSupportTicketDialog;
