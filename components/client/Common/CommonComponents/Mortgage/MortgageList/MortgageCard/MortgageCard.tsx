'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import formatChoiceFieldValue, {
  formatDate,
  getCurrencySign,
} from '@/utils/formatters';
import { getMortgageUrl } from '@/utils/redirectPath';
import { ChevronDown, ChevronUp, Eye, Pencil, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteMortgageDialog from '../../Dialogs/DeleteMortgageDialog';
import UpdateMortgageDialog from '../../Dialogs/UpdateMortgageDialog';

const MortgageCard: React.FC<{ mortgage: Mortgage }> = ({ mortgage }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <Card className='group py-0 shadow-lg transition-all hover:-translate-y-1'>
      <CardContent className='space-y-5 p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-muted-foreground text-sm'>
              {mortgage.property.property_name}
            </p>
            <div className='mt-1 flex flex-wrap items-center gap-3'>
              <h2 className='text-xl font-bold'>
                {mortgage.lender_name} –{' '}
                {formatChoiceFieldValue(mortgage.interest_rate_type)}
              </h2>
            </div>
          </div>
          <div className='shrink-0 text-right'>
            <p className='text-muted-foreground text-xs'>Interest Rate</p>
            <p className='text-2xl font-bold'>
              {parseFloat(mortgage.interest_rate ?? '0')}%
            </p>
            <p>
              <span className='text-muted-foreground text-xs'>
                Interest Rate Expiry:{' '}
              </span>
              {formatDate(mortgage?.interest_rate_expiry_date)}
            </p>
          </div>
        </div>

        {/* Balance + View Documents */}
        <div className='flex items-end justify-between'>
          <div>
            <p className='text-3xl font-bold'>
              {getCurrencySign()}
              {parseFloat(mortgage.outstanding_balance ?? '0').toLocaleString(
                'en-GB',
              )}
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Outstanding Balance
            </p>
          </div>

          <div className='shrink-0'>
            {mortgage.uploaded_documents.length === 0 ? (
              <Button variant='outline' size='sm' disabled>
                <Eye />
                View Documents
              </Button>
            ) : mortgage.uploaded_documents.length === 1 ? (
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  window.open(mortgage.uploaded_documents[0].file, '_blank')
                }
              >
                <Eye />
                View Documents
              </Button>
            ) : (
              <Popover open={docsOpen} onOpenChange={setDocsOpen}>
                <PopoverTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <Eye />
                    View Documents
                    {docsOpen ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64 p-2' align='center'>
                  <ul className='space-y-1'>
                    {mortgage.uploaded_documents.map((doc) => {
                      const filename =
                        doc.file.split('/').pop() || `file-${doc.id}`;
                      return (
                        <li key={doc.id}>
                          <a
                            href={doc.file}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm'
                          >
                            <span className='truncate'>{filename}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className='border-border border-t' />

        <div className='grid grid-cols-3 gap-4'>
          <div>
            <p className='mt-1'>
              <span className='text-muted-foreground text-xs'>EPC Rating:</span>{' '}
              {mortgage.epc_rating ? (
                <span className='text-sm font-semibold'>
                  {mortgage.epc_rating}
                </span>
              ) : (
                <span className='text-muted-foreground text-xs'>Not Found</span>
              )}
            </p>
            <p className='mt-1'>
              <span className='text-muted-foreground text-xs'>EPC Expiry:</span>{' '}
              {mortgage.epc_certificate_expiry_date ? (
                <span className='text-sm font-semibold'>
                  {formatDate(mortgage.epc_certificate_expiry_date)}
                </span>
              ) : (
                <span className='text-muted-foreground text-xs'>Not Found</span>
              )}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Monthly Payment</p>
            <p className='mt-1 text-base font-semibold'>
              {getCurrencySign()}
              {parseFloat(mortgage.monthly_payment ?? '0').toLocaleString(
                'en-GB',
              )}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>
              Remaining Mortgage Term(Years)
            </p>
            <p className='mt-1 text-base font-semibold'>
              {mortgage.remaining_mortgage}
            </p>
          </div>
        </div>

        <div className='border-border border-t' />

        <div className='flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='items-center gap-2'>
            <p>Notes:</p>
            {mortgage.notes ? (
              <small>{mortgage.notes}</small>
            ) : (
              <small className='text-muted-foreground'>
                No notes available
              </small>
            )}
          </div>

          <div className='flex items-center gap-2 opacity-100 md:translate-y-1 md:scale-95 md:opacity-0 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100'>
            <Button variant='outline' onClick={() => setEditOpen(true)}>
              <Pencil className='size-4' />
              Edit
            </Button>
            <Button variant='destructive' onClick={() => setDeleteOpen(true)}>
              <Trash2 className='size-4' />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>

      <UpdateMortgageDialog
        key={mortgage.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mortgage={mortgage}
      />

      <DeleteMortgageDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getMortgageUrl(session))}
        mortgageAlias={mortgage.alias}
      />
    </Card>
  );
};

export default MortgageCard;
