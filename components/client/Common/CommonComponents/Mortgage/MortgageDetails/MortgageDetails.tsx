'use client';

import DetailsEmptyState from '@/components/common/DetailsPage/DetailsEmptyState';
import DetailsPageHeader from '@/components/common/DetailsPage/DetailsPageHeader';
import DetailsRecordHistory from '@/components/common/DetailsPage/DetailsRecordHistory';
import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  exhibitLabel,
  fileMeta,
  isEpcAtRisk,
  rateTypeLabel,
} from '@/data/client/Common/Mortgage/MortgageData';
import { useGetMortgageDetailsQuery } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import { MortgagePropertyType } from '@/types/client/Common/Mortgage/MortgageDetailsTypes';
import {
  formatCurrency,
  formatDate,
  getDaysUntilDue,
} from '@/utils/formatters';
import {
  AlertTriangle,
  CalendarClock,
  Edit,
  ExternalLink,
  FileX,
  Landmark,
  Paperclip,
  StickyNote,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import UpdateMortgageDialog from '../Dialogs/UpdateMortgageDialog';
import MortgageDangerZone from './MortgageDangerZone/MortgageDangerZone';
import MortgageDetailsSkeleton from './MortgageDetailsSkeleton';
import MortgagePermissionList from './MortgagePermissionList/MortgagePermissionList';

const MortgageDetails: React.FC = () => {
  const { data: session } = useSession();
  const { mortgagealias } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const {
    data: mortgage,
    isLoading,
    isError,
  } = useGetMortgageDetailsQuery({ mortgage_alias: mortgagealias });

  const mortgageData: MortgagePropertyType | undefined = mortgage as
    MortgagePropertyType | undefined;

  if (isLoading) return <MortgageDetailsSkeleton />;

  if (isError || !mortgage) {
    return (
      <div className='mx-auto py-10'>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Couldn&apos;t load this mortgage record</AlertTitle>
          <AlertDescription>
            Check the link and try again, or come back to it later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const rateDays = getDaysUntilDue(mortgageData?.interest_rate_expiry_date);
  const epcDays = getDaysUntilDue(mortgageData?.epc_certificate_expiry_date);
  const epcAtRisk = isEpcAtRisk(mortgageData?.epc_rating);

  // Position markers along a shared timeline from today to the furthest date
  const maxHorizon = Math.max(rateDays ?? 0, epcDays ?? 0, 1);
  const ratePct =
    rateDays !== null
      ? Math.min(95, Math.max(5, (rateDays / maxHorizon) * 90 + 5))
      : null;
  const epcPct =
    epcDays !== null
      ? Math.min(95, Math.max(5, (epcDays / maxHorizon) * 90 + 5))
      : null;

  const keyFigures = [
    {
      label: 'Outstanding balance',
      value: formatCurrency(mortgageData?.outstanding_balance),
    },
    {
      label: 'Monthly payment',
      value: formatCurrency(mortgageData?.monthly_payment),
    },
    {
      label: 'Interest rate',
      value:
        mortgageData?.interest_rate != null
          ? `${mortgageData.interest_rate}%`
          : undefined,
    },
  ];

  return (
    <div className='mx-auto space-y-6'>
      {/* Masthead */}
      <DetailsPageHeader
        eyebrow='Mortgage record'
        title={mortgageData?.property?.property_name ?? 'Untitled property'}
        description={
          <>
            Held with{' '}
            <span className='text-foreground font-medium'>
              {mortgageData?.lender_name}
            </span>
          </>
        }
        meta={
          <>
            <Badge
              variant='secondary'
              className='rounded-full px-3 py-1 font-mono text-xs'
            >
              {rateTypeLabel(mortgageData?.interest_rate_type || 'Not set')}
            </Badge>
            <Badge
              className='rounded-full px-3 py-1 font-mono text-xs'
              variant={epcAtRisk ? 'destructive' : 'default'}
            >
              EPC: {mortgageData?.epc_rating ?? 'Not set'}
            </Badge>
          </>
        }
        actions={
          mortgageData?.can_edit && (
            <Button onClick={() => setEditOpen(true)}>
              <Edit />
              Edit
            </Button>
          )
        }
      />

      {/* Compliance flag */}
      {epcAtRisk && (
        <Alert variant='destructive' className='rounded-2xl'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>EPC rating needs attention</AlertTitle>
          <AlertDescription>
            This property is rated {mortgageData?.epc_rating}, below the
            standard typically required to let. The certificate expires{' '}
            {formatDate(mortgageData?.epc_certificate_expiry_date)}.
          </AlertDescription>
        </Alert>
      )}

      {/* Key figures */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {keyFigures.map(({ label, value }) => (
          <div key={label} className='bg-card rounded-2xl border p-5 shadow-xs'>
            <p className='text-muted-foreground text-xs'>{label}</p>
            <p className='text-foreground mt-1 font-mono text-xl font-semibold tracking-tight'>
              {value || (
                <span className='text-muted-foreground text-sm font-normal'>
                  Not provided
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <DetailsSection title='Key Dates' icon={CalendarClock}>
        <div className='relative mt-2 mb-8 h-16'>
          <div className='bg-border absolute top-8 right-0 left-0 h-px' />
          <div className='bg-primary absolute top-8 left-0 h-2 w-2 -translate-y-1/2 rounded-full' />
          <span className='text-muted-foreground absolute top-0 left-0 text-xs'>
            Today
          </span>

          {ratePct !== null && (
            <div
              className='absolute top-8 -translate-x-1/2'
              style={{ left: `${ratePct}%` }}
            >
              <div className='bg-primary h-2 w-2 -translate-y-1/2 rounded-full' />
              <div className='mt-1 flex flex-col items-center gap-1 text-center'>
                <span className='text-foreground text-xs font-medium whitespace-nowrap'>
                  Rate expires
                </span>
                <span className='text-muted-foreground font-mono text-xs whitespace-nowrap'>
                  {formatDate(mortgageData?.interest_rate_expiry_date)}
                </span>
                <Badge variant='outline' className='font-mono text-[10px]'>
                  {rateDays! >= 0 ? `${rateDays}d` : 'passed'}
                </Badge>
              </div>
            </div>
          )}

          {epcPct !== null && (
            <div
              className='absolute top-8 -translate-x-1/2'
              style={{ left: `${epcPct}%` }}
            >
              <div
                className={`h-2 w-2 -translate-y-1/2 rounded-full ${
                  epcAtRisk ? 'bg-destructive' : 'bg-secondary-foreground'
                }`}
              />
              <div className='mt-1 flex flex-col items-center gap-1 text-center'>
                <span className='text-foreground text-xs font-medium whitespace-nowrap'>
                  EPC expires
                </span>
                <span className='text-muted-foreground font-mono text-xs whitespace-nowrap'>
                  {formatDate(mortgageData?.epc_certificate_expiry_date)}
                </span>
                <Badge
                  variant={epcAtRisk ? 'destructive' : 'outline'}
                  className='font-mono text-[10px]'
                >
                  {epcDays! >= 0 ? `${epcDays}d` : 'passed'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </DetailsSection>

      <div className='grid gap-6 md:grid-cols-[1.6fr_1fr]'>
        {/* Particulars register */}
        <DetailsSection
          title='Particulars'
          icon={Landmark}
          contentClassName='space-y-3'
        >
          {[
            ['Lender', mortgageData?.lender_name],
            [
              'Rate type',
              mortgageData?.interest_rate_type &&
                rateTypeLabel(mortgageData.interest_rate_type),
            ],
            [
              'Interest rate',
              mortgageData?.interest_rate != null
                ? `${mortgageData.interest_rate}%`
                : undefined,
            ],
            [
              'Rate expiry',
              formatDate(mortgageData?.interest_rate_expiry_date),
            ],
            [
              'Outstanding balance',
              formatCurrency(mortgageData?.outstanding_balance),
            ],
            ['Monthly payment', formatCurrency(mortgageData?.monthly_payment)],
            [
              'Remaining term',
              mortgageData?.remaining_mortgage != null
                ? `${mortgageData.remaining_mortgage} yrs`
                : undefined,
            ],
          ].map(([label, value]) => (
            <div key={label} className='flex items-baseline gap-2'>
              <span className='text-muted-foreground text-sm whitespace-nowrap'>
                {label}
              </span>
              <span className='border-border flex-1 border-b border-dashed' />
              <span className='text-foreground font-mono text-sm font-medium whitespace-nowrap'>
                {value || 'Not provided'}
              </span>
            </div>
          ))}
        </DetailsSection>

        {/* Documents + notes */}
        <div className='space-y-6'>
          <DetailsSection
            title='Documents'
            icon={Paperclip}
            contentClassName='space-y-1'
          >
            {mortgageData?.uploaded_documents?.length ? (
              mortgageData.uploaded_documents.map((doc, i) => {
                const meta = fileMeta(doc.file);
                const Icon = meta.icon;
                return (
                  <a
                    key={doc.id}
                    href={doc.file}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:bg-primary/5 hover:border-primary/20 flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors'
                  >
                    <span className='text-muted-foreground font-mono text-xs'>
                      Ex. {exhibitLabel(i)}
                    </span>
                    <Icon className='text-primary h-4 w-4 shrink-0' />
                    <span className='text-foreground flex-1 truncate text-sm'>
                      {doc.description || meta.name}
                    </span>
                    <Badge variant='secondary' className='text-[10px]'>
                      {meta.kind}
                    </Badge>
                    <ExternalLink className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
                  </a>
                );
              })
            ) : (
              <DetailsEmptyState
                icon={FileX}
                message='No documents uploaded.'
                className='py-6'
              />
            )}
          </DetailsSection>

          {mortgageData?.notes && (
            <DetailsSection title='Notes' icon={StickyNote}>
              <p className='text-foreground text-sm leading-relaxed whitespace-pre-line'>
                {mortgageData.notes}
              </p>
            </DetailsSection>
          )}
        </div>
      </div>

      {/* Record history */}
      <DetailsRecordHistory
        createdAt={mortgageData?.created_at}
        updatedAt={mortgageData?.updated_at}
      />
      {/* Permission list */}
      {session?.user?.role === 'LANDLORD' && (
        <MortgagePermissionList mortgageAlias={mortgageData?.alias ?? ''} />
      )}
      {/* Danger zone */}
      {session?.user?.role === 'LANDLORD' && (
        <MortgageDangerZone mortgage={mortgageData} />
      )}
      {/* Dialogs */}
      <UpdateMortgageDialog
        key={mortgage.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mortgage={mortgage}
      />
    </div>
  );
};

export default MortgageDetails;
