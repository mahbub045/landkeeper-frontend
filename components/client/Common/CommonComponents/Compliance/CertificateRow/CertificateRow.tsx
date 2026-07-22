'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  ApiCertificate,
  Certificate,
  CertStatus,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { formatDate } from '@/utils/formatters';
import { getComplianceUrl } from '@/utils/redirectPath';
import { Pencil, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteCertificateDialog from '../Dialogs/DeleteCertificateDialog';
import UpdateCertificateDialog from '../Dialogs/UpdateCertificateDialog';

const statusConfig: Record<CertStatus, { color: string; dot: string }> = {
  Valid: { color: 'bg-success/10 text-success', dot: 'bg-success' },
  Expired: { color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
  'Expiring Soon': { color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
};

interface CertificateRowProps {
  cert: Certificate;
  apiCertificate: ApiCertificate;
}

const CertificateRow: React.FC<CertificateRowProps> = ({
  cert,
  apiCertificate,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { color, dot } = statusConfig[cert.status];

  return (
    <>
      <TableRow className='text-center'>
        <TableCell className='text-muted-foreground px-6 text-sm'>
          {cert.property || 'Not Available'}
        </TableCell>
        <TableCell className='text-muted-foreground px-6 text-sm'>
          <span className='flex items-center justify-center gap-2'>
            <span className='text-primary'>✳</span>
            {cert.type || 'Not Available'}
          </span>
        </TableCell>
        <TableCell className='text-muted-foreground px-6 text-sm'>
          {cert.certificateNumber || 'Not Available'}
        </TableCell>
        <TableCell className='text-muted-foreground px-6 text-sm'>
          <div className='flex flex-col gap-0.5'>
            <span>Issue: {formatDate(cert.issueDate) || 'Not Available'}</span>
            <span>
              Expiry: {formatDate(cert.expiryDate) || 'Not Available'}
            </span>
          </div>
        </TableCell>
        <TableCell className='px-6'>
          {apiCertificate.certificate_file ? (
            <Button variant='outline' size='sm' className='rounded-lg' asChild>
              <a
                href={apiCertificate.certificate_file}
                target='_blank'
                rel='noopener noreferrer'
              >
                View
              </a>
            </Button>
          ) : (
            <span className='text-muted-foreground text-sm'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='px-6'>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${color}`}
          >
            <span className={`inline-block size-1.5 rounded-full ${dot}`} />
            {cert.status}
          </Badge>
        </TableCell>
        <TableCell className='px-6'>
          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='default'
              size='icon'
              className='rounded-lg'
              title='Edit Certificate'
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            <Button
              variant='danger'
              size='icon'
              className='rounded-lg'
              title='Delete Certificate'
              onClick={() => setDeleteOpen(true)}
            >
              <Trash />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <UpdateCertificateDialog
        key={apiCertificate.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        certificate={apiCertificate}
      />

      <DeleteCertificateDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getComplianceUrl(session))}
        certificateAlias={apiCertificate.alias}
      />
    </>
  );
};

export default CertificateRow;
