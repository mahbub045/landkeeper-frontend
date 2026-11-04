'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { DetailsCopyIdProps } from '@/types/common/DetailsPage/DetailsPageTypes';
import { Check, Copy } from 'lucide-react';

const DetailsCopyId: React.FC<DetailsCopyIdProps> = ({
  copyKey,
  value,
  label,
}) => {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <span className='bg-background/80 inline-flex items-center gap-1.5 rounded-full border py-0.5 pr-1 pl-2.5 font-mono text-xs font-medium tracking-wide'>
      {value}
      <button
        type='button'
        onClick={() =>
          copy(copyKey, value, {
            successMessage: `${label} copied to clipboard.`,
          })
        }
        className='hover:bg-primary/10 flex size-5 cursor-pointer items-center justify-center rounded-full transition-colors'
        aria-label={`Copy ${label.toLowerCase()}`}
        title={`Copy ${label.toLowerCase()}`}
      >
        {isCopied(copyKey) ? (
          <Check className='text-success size-3' />
        ) : (
          <Copy className='text-primary size-3' />
        )}
      </button>
    </span>
  );
};

export default DetailsCopyId;
