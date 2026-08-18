'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import formatChoiceFieldValue, { getCurrencySign } from '@/utils/formatters';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useState } from 'react';

const MortgageCard: React.FC<{ mortgage: Mortgage }> = ({ mortgage }) => {
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
      </CardContent>
    </Card>
  );
};

export default MortgageCard;
