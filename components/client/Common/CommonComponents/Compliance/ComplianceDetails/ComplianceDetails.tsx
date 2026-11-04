'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import DetailsCopyId from '@/components/common/DetailsPage/DetailsCopyId';
import DetailsDangerZone from '@/components/common/DetailsPage/DetailsDangerZone';
import DetailsEmptyState from '@/components/common/DetailsPage/DetailsEmptyState';
import DetailsInfoItem from '@/components/common/DetailsPage/DetailsInfoItem';
import DetailsPageHeader from '@/components/common/DetailsPage/DetailsPageHeader';
import DetailsRecordHistory from '@/components/common/DetailsPage/DetailsRecordHistory';
import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CERTIFICATE_STYLES,
  getCertStatus,
  getCertStatusTone,
  getDaysUntilExpiry,
} from '@/data/client/Common/Compliance/ComplianceData';
import { useGetComplianceDetailsQuery } from '@/store/api/endpoints/client/Common/Compliance/ComplianceApi';
import { useAppSelector } from '@/store/hooks';
import { ApiCertificate } from '@/types/client/Common/Compliance/ComplianceTypes';
import formatChoiceFieldValue, { formatDate } from '@/utils/formatters';
import { getComplianceUrl, getPropertyDetailsUrl } from '@/utils/redirectPath';
import {
  Building2,
  CalendarCheck,
  CalendarX,
  ExternalLink,
  FileText,
  FileX,
  Hash,
  Info,
  Paperclip,
  Pencil,
  UserCheck,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getCertificateLabel } from '../CertificateRegistry/CertificateRow/CertificateRow';
import DeleteCertificateDialog from '../Dialogs/DeleteCertificateDialog';
import UpdateCertificateDialog from '../Dialogs/UpdateCertificateDialog';
import ComplianceDetailsSkeleton from './ComplianceDetailsSkeleton';
import ComplianceExpiryTimeline from './ComplianceExpiryTimeline/ComplianceExpiryTimeline';
import ComplianceRenewNotice from './ComplianceRenewNotice/ComplianceRenewNotice';
import ComplianceShareList from './ComplianceShareList/ComplianceShareList';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

const getFileExtension = (url: string) =>
  url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';

const getExpiryText = (expiryDate: string | null, daysUntilExpiry: number) => {
  // new Date(null) is the 1970 epoch, which would read as decades overdue
  if (!expiryDate) return 'No expiry date set';
  if (daysUntilExpiry < 0)
    return `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) === 1 ? '' : 's'} ago`;
  if (daysUntilExpiry === 0) return 'Expires today';
  return `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`;
};

const ComplianceDetails: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { compliancealias } = useParams<{ compliancealias: string }>();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Stops the refetch of the deleted certificate (and its error screen)
  // while we navigate back to the list
  const [isDeleted, setIsDeleted] = useState(false);

  const { data, isLoading, isError } = useGetComplianceDetailsQuery(
    compliancealias,
    { skip: !compliancealias || isDeleted },
  );

  const certificate: ApiCertificate | undefined = data;

  const handleDeleteSuccess = () => {
    setIsDeleted(true);
    router.replace(getComplianceUrl(session, landlordAlias));
  };

  if (isDeleted) return null;

  if (isLoading) return <ComplianceDetailsSkeleton />;

  if (isError || !certificate) {
    return (
      <div className='mx-auto w-full max-w-6xl py-16'>
        <CustomErrorMessage title='certificate' />
      </div>
    );
  }

  const status = getCertStatus(certificate.expiry_date);
  const { color, dot } = getCertStatusTone(certificate.expiry_date);
  const daysUntilExpiry = getDaysUntilExpiry(certificate.expiry_date);
  const expiryText = getExpiryText(certificate.expiry_date, daysUntilExpiry);
  const fileExtension = certificate.certificate_file
    ? getFileExtension(certificate.certificate_file)
    : '';
  const certificateLabel = certificate.certificate_type
    ? getCertificateLabel(certificate.certificate_type)
    : 'Certificate';

  const infoItems = [
    {
      icon: FileText,
      label: 'Certificate Type',
      value: certificate.certificate_type
        ? getCertificateLabel(certificate.certificate_type)
        : null,
    },
    {
      icon: Hash,
      label: 'Certificate Number',
      value: certificate.certificate_number,
    },
    {
      icon: CalendarCheck,
      label: 'Issue Date',
      value: formatDate(certificate.issue_date),
    },
    {
      icon: CalendarX,
      label: 'Expiry Date',
      value: formatDate(certificate.expiry_date),
    },
    { icon: UserCheck, label: 'Issued By', value: certificate.issued_by },
    {
      icon: Building2,
      label: 'Property',
      value: certificate.property?.alias ? (
        <Link
          href={getPropertyDetailsUrl(
            session,
            certificate.property.alias,
            landlordAlias,
          )}
          className='text-primary hover:underline'
        >
          {certificate.property.property_name}
        </Link>
      ) : null,
    },
  ];

  return (
    <div className='mx-auto space-y-6'>
      <DetailsPageHeader
        eyebrow='Compliance certificate'
        title={certificateLabel}
        description={expiryText}
        meta={
          <>
            {certificate.certificate_number && (
              <DetailsCopyId
                copyKey={certificate.alias}
                value={certificate.certificate_number}
                label='Certificate number'
              />
            )}
            <Badge
              className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${color}`}
            >
              <span className={`inline-block size-1.5 rounded-full ${dot}`} />
              {status}
            </Badge>
            {certificate.certificate_type && (
              <Badge
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  CERTIFICATE_STYLES[certificate.certificate_type] ??
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {formatChoiceFieldValue(certificate.certificate_type)}
              </Badge>
            )}
          </>
        }
        actions={
          <Button onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit
          </Button>
        }
      />

      {certificate.expiry_date && status !== 'Valid' && (
        <ComplianceRenewNotice
          status={status}
          expiryText={expiryText}
          daysUntilExpiry={daysUntilExpiry}
          onRenewClick={() => setEditOpen(true)}
        />
      )}

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <DetailsSection title='Certificate Information' icon={Info}>
          <dl className='grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
            {infoItems.map((item) => (
              <DetailsInfoItem key={item.label} {...item} />
            ))}
          </dl>
        </DetailsSection>

        <ComplianceExpiryTimeline
          issueDate={certificate.issue_date}
          expiryDate={certificate.expiry_date}
        />
      </div>

      <DetailsSection
        title='Document'
        icon={Paperclip}
        action={
          certificate.certificate_file && (
            <Button variant='outline' size='sm' asChild>
              <a
                href={certificate.certificate_file}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='size-4' />
                Open
              </a>
            </Button>
          )
        }
      >
        {!certificate.certificate_file ? (
          <DetailsEmptyState icon={FileX} message='No document was uploaded' />
        ) : IMAGE_EXTENSIONS.includes(fileExtension) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.certificate_file}
            alt={`Certificate document for ${certificate.certificate_number}`}
            className='bg-muted/30 max-h-150 w-full rounded-xl border object-contain'
          />
        ) : fileExtension === 'pdf' ? (
          <iframe
            src={certificate.certificate_file}
            title='Certificate document'
            className='h-150 w-full rounded-xl border'
          />
        ) : (
          <DetailsEmptyState
            icon={FileText}
            message="Preview isn't available for this file type. Use Open to view it."
          />
        )}
      </DetailsSection>

      <DetailsRecordHistory
        createdAt={certificate.created_at}
        updatedAt={certificate.updated_at}
      />

      <ComplianceShareList
        certificateAlias={certificate.alias}
        propertyAlias={certificate.property?.alias || ''}
      />

      <DetailsDangerZone
        title='Delete certificate'
        description='Permanently removes this certificate and its compliance records. This cannot be undone.'
        onDeleteClick={() => setDeleteOpen(true)}
      />

      {/* Dialogs */}

      <UpdateCertificateDialog
        key={certificate.updated_at}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        certificate={certificate}
      />

      <DeleteCertificateDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
        certificateAlias={certificate.alias}
        certificateName={certificateLabel}
        certificateNumber={certificate.certificate_number}
      />
    </div>
  );
};

export default ComplianceDetails;
