'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  ApiCertificate,
  CertStatus,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { formatDate } from '@/utils/formatters';
import { getComplianceUrl } from '@/utils/redirectPath';
import { Pencil, ShieldUser, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteCertificateDialog from '../../Dialogs/DeleteCertificateDialog';
import UpdateCertificateDialog from '../../Dialogs/UpdateCertificateDialog';
import ViewCertificateSharesDialog from '../Dialogs/ViewCertificateSharesDialog';

const statusConfig: Record<CertStatus, { color: string; dot: string }> = {
  Valid: { color: 'bg-success/10 text-success', dot: 'bg-success' },
  Expired: { color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
  'Expiring Soon': { color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
};

interface CertificateRowProps {
  cert: ApiCertificate;
  index: number;
}

const humanizeCertType = (type: string) =>
  type
    .toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const getCertStatus = (expiryDate: string): CertStatus => {
  const daysUntilExpiry = Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry <= 30) return 'Expiring Soon';
  return 'Valid';
};

const CertificateRow: React.FC<CertificateRowProps> = ({ cert, index }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const status = getCertStatus(cert.expiry_date);
  const { color, dot } = statusConfig[status];
  const [isOpenViewShares, setIsOpenViewShares] = useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<ApiCertificate | null>(null);

  const handleViewShares = (certificate: ApiCertificate) => {
    setSelectedCertificate(certificate);
    setIsOpenViewShares(true);
  };

  return (
    <>
      <TableRow className='text-centers'>
        <TableCell className='text-sm'>{index + 1}.</TableCell>
        <TableCell className='text-sm'>
          {cert.property?.property_name || (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='text-sm'>
          <span className='flex items-center justify-start gap-2'>
            <span className='text-primary'>✳</span>
            {cert.certificate_type ? (
              humanizeCertType(cert.certificate_type)
            ) : (
              <span className='text-muted-foreground text-xs'>
                Not Available
              </span>
            )}
          </span>
        </TableCell>
        <TableCell className='text-sm'>
          {cert.certificate_number || (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='text-sm'>
          <div className='flex flex-col gap-0.5'>
            <span>
              Issue:{' '}
              {formatDate(cert.issue_date) || (
                <span className='text-muted-foreground text-xs'>
                  Not Available
                </span>
              )}
            </span>
            <span>
              Expiry:{' '}
              {formatDate(cert.expiry_date) || (
                <span className='text-muted-foreground text-xs'>
                  Not Available
                </span>
              )}
            </span>
          </div>
        </TableCell>
        <TableCell className='text-center'>
          {cert.certificate_file ? (
            <Button variant='outline' size='sm' className='rounded-lg' asChild>
              <a
                href={cert.certificate_file}
                target='_blank'
                rel='noopener noreferrer'
              >
                View
              </a>
            </Button>
          ) : (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='text-center'>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${color}`}
          >
            <span className={`inline-block size-1.5 rounded-full ${dot}`} />
            {status ?? (
              <span className='text-muted-foreground text-xs'>
                Not Available
              </span>
            )}
          </Badge>
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='secondary'
              size='icon'
              title='View Certificate Shares'
              className='rounded-lg'
              onClick={() => handleViewShares(cert)}
            >
              <ShieldUser />
            </Button>
            <Button
              variant='default'
              size='icon'
              title='Edit Certificate'
              className='rounded-lg'
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            <Button
              variant='danger'
              size='icon'
              title='Delete Certificate'
              className='rounded-lg'
              onClick={() => setDeleteOpen(true)}
            >
              <Trash />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Dialogs  */}

      <ViewCertificateSharesDialog
        open={isOpenViewShares}
        onClose={() => setIsOpenViewShares(false)}
        selectedCertificate={selectedCertificate}
        propertyAlias={cert.property?.alias || ''}
        complianceAlias={cert?.alias || ''}
      />

      <UpdateCertificateDialog
        key={cert.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        certificate={cert}
      />

      <DeleteCertificateDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getComplianceUrl(session))}
        certificateAlias={cert.alias}
      />
    </>
  );
};

export default CertificateRow;
