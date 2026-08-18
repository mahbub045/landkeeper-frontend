'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  exhibitLabel,
  fileMeta,
  isEpcAtRisk,
  rateTypeLabel,
} from '@/data/client/common/mortgage/MortgageData';
import { useGetMortgageDetailsQuery } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import { MortgagePropertyType } from '@/types/client/Common/Mortgage/MortgageDetailsTypes';
import { formatCurrency, formatDate, getDaysUntilDue } from '@/utils/formatters';
import {
  AlertTriangle,
  ArrowLeft,
  Edit,
  ExternalLink,
  StickyNote,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import UpdateMortgageDialog from '../Dialogs/UpdateMortgageDialog';
import MortgageDangerZone from './MortgageDangerZone/MortgageDangerZone';

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
    | MortgagePropertyType
    | undefined;

  if (isLoading) {
    return (
      <div className='mx-auto space-y-8 py-10'>
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-20 w-full' />
        <div className='grid gap-8 md:grid-cols-[1.6fr_1fr]'>
          <Skeleton className='h-72 w-full' />
          <Skeleton className='h-72 w-full' />
        </div>
      </div>
    );
  }

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

  return (
    <div className='mx-auto space-y-8 py-10'>
      {/* Masthead */}
      <div className='relative flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end'>
        <div>
          <p className='text-secondary-foreground/60 mb-1 text-xs font-medium tracking-widest uppercase'>
            Mortgage record
          </p>

          <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>
            {mortgageData?.property?.property_name ?? 'Untitled property'}
          </h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            Held with{' '}
            <span className='text-foreground font-medium'>
              {mortgageData?.lender_name}
            </span>
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <div className='absolute top-0 right-0 flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => window.history.back()}
            >
              <ArrowLeft />
              Back
            </Button>
            <Button
              size='sm'
              variant='default'
              onClick={() => setEditOpen(true)}
            >
              <Edit />
              Edit
            </Button>
          </div>

          <Badge variant='secondary' className='font-mono text-xs'>
            {rateTypeLabel(mortgageData?.interest_rate_type)}
          </Badge>
          <Badge
            className='font-mono text-xs'
            variant={epcAtRisk ? 'destructive' : 'default'}
          >
            <span>EPC:</span>
            {mortgageData?.epc_rating ?? (
              <span className='text-muted-foreground'>Not set</span>
            )}
          </Badge>
        </div>
      </div>

      {/* Compliance flag */}
      {epcAtRisk && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>EPC rating needs attention</AlertTitle>
          <AlertDescription>
            This property is rated {mortgageData?.epc_rating}, below the
            standard typically required to let. The certificate expires{' '}
            {formatDate(mortgageData?.epc_certificate_expiry_date)}.
          </AlertDescription>
        </Alert>
      )}

      {/* Timeline */}
      <Card className='shadow-lg'>
        <CardHeader className='pb-2'>
          <p className='text-muted-foreground text-sm font-medium'>Key dates</p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className='grid gap-8 md:grid-cols-[1.6fr_1fr]'>
        {/* Particulars register */}
        <Card className='shadow-lg'>
          <CardHeader className='pb-2'>
            <p className='text-muted-foreground text-sm font-medium'>
              Particulars
            </p>
          </CardHeader>
          <CardContent className='space-y-3'>
            {[
              ['Lender', mortgageData?.lender_name],
              ['Rate type', rateTypeLabel(mortgageData?.interest_rate_type)],
              ['Interest rate', `${mortgageData?.interest_rate}%`],
              [
                'Rate expiry',
                formatDate(mortgageData?.interest_rate_expiry_date),
              ],
              [
                'Outstanding balance',
                formatCurrency(mortgageData?.outstanding_balance),
              ],
              [
                'Monthly payment',
                formatCurrency(mortgageData?.monthly_payment),
              ],
              ['Remaining term', `${mortgageData?.remaining_mortgage} yrs`],
            ].map(([label, value]) => (
              <div key={label} className='flex items-baseline gap-2'>
                <span className='text-muted-foreground text-sm whitespace-nowrap'>
                  {label}
                </span>
                <span className='border-border flex-1 border-b border-dashed' />
                <span className='text-foreground font-mono text-sm font-medium whitespace-nowrap'>
                  {value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents + notes */}
        <div className='space-y-8'>
          <Card className='shadow-lg'>
            <CardHeader className='pb-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                Documents
              </p>
            </CardHeader>
            <CardContent className='space-y-1'>
              {mortgageData?.uploaded_documents?.length ? (
                mortgageData.uploaded_documents.map((doc, i) => {
                  const meta = fileMeta(doc.file);
                  const Icon = meta.icon;
                  return (
                    <div key={doc.id}>
                      {i > 0 && <Separator className='my-1' />}
                      <a
                        href={doc.file}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:bg-secondary/50 flex items-center gap-3 rounded-md py-2 transition-colors'
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
                    </div>
                  );
                })
              ) : (
                <p className='text-muted-foreground py-2 text-sm'>
                  No documents uploaded.
                </p>
              )}
            </CardContent>
          </Card>

          {mortgageData?.notes && (
            <Card className='shadow-lg'>
              <CardHeader className='flex flex-row items-center gap-2 pb-2'>
                <StickyNote className='text-muted-foreground h-4 w-4' />
                <p className='text-muted-foreground text-sm font-medium'>
                  Notes
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-foreground text-sm leading-relaxed'>
                  {mortgageData.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Danger zone */}
      {session?.user?.role === 'LANDLORD' && (
        <MortgageDangerZone mortgage={mortgageData} />
      )}
      {/* Dailogs  */}
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
