import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ViewCertificateSharesDialogProps } from '@/types/client/Common/Compliance/CertificateSharesTypes';
import { Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import AddNewShareDialog from './AddNewShareDialog';

const ViewCertificateSharesDialog: React.FC<
  ViewCertificateSharesDialogProps
> = ({ open, onClose }) => {
  const [isOpenAddNewShareDialogOpen, setIsOpenAddNewShareDialogOpen] =
    useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            View Certificate Shares
          </DialogTitle>
          <DialogDescription>
            View the shares associated with this certificate. You can see which
            users or groups have access to this certificate and what actions
            they are allowed to perform.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className='flex items-center justify-between border-b px-6 pb-4'>
            <h2 className='text-xl font-semibold'>Share List</h2>
            <Button onClick={() => setIsOpenAddNewShareDialogOpen(true)}>
              <Plus />
              Add New Share
            </Button>
          </div>
          <div className='overflow-auto px-6 py-4'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Admins</TableCell>
                  <TableCell className='flex justify-center gap-2'>
                    <Button variant='destructive' size='icon'>
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              </tbody>
            </Table>
          </div>
        </div>
      </DialogContent>
      {/* Dialogs  */}
      <AddNewShareDialog
        open={isOpenAddNewShareDialogOpen}
        onClose={() => setIsOpenAddNewShareDialogOpen(false)}
      />
    </Dialog>
  );
};

export default ViewCertificateSharesDialog;
