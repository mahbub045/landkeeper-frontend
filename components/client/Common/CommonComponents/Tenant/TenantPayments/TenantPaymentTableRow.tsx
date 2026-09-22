'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { STATUS_CONFIG } from '@/data/client/common/tenant/TenantPaymentsData';
import CardBrandLogo from '@/data/common/CardBrandLogo';
import { cn } from '@/lib/utils';
import { TenantPaymentType } from '@/types/client/Common/Tenant/TenantsTypes';
import {
  formatCurrency,
  formatDate,
  formatDateAndTime,
} from '@/utils/formatters';
import {
  Building2,
  ChevronDown,
  CircleOff,
  Download,
  StickyNote,
} from 'lucide-react';
import { useState } from 'react';

const PROPERTY_PREVIEW_LENGTH = 25;

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status.toUpperCase()] ?? STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <Badge
      variant='outline'
      className={cn('gap-1 font-normal', config.className)}
    >
      <Icon className='h-3.5 w-3.5' />
      {config.label}
    </Badge>
  );
}

const TenantPaymentTableRow: React.FC<{
  payment: TenantPaymentType;
  rowNumber: number;
  columnCount: number;
}> = ({ payment, rowNumber, columnCount }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className='px-6 text-sm'>{rowNumber}</TableCell>
        <TableCell className='text-sm'>
          {payment.created_at ? (
            formatDateAndTime(payment.created_at)
          ) : (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell>
          <p className='text-foreground text-sm font-semibold'>
            {payment.tenant_name}
          </p>
        </TableCell>
        <TableCell>
          <div className='flex flex-col leading-tight'>
            <span className='text-foreground text-sm font-medium'>
              {payment.property_name
                ? truncateText(payment.property_name, PROPERTY_PREVIEW_LENGTH)
                : 'Not Available'}
            </span>
            {payment.property_address &&
              payment.property_address !== payment.property_name && (
                <span className='text-muted-foreground text-xs'>
                  {truncateText(
                    payment.property_address,
                    PROPERTY_PREVIEW_LENGTH,
                  )}
                </span>
              )}
          </div>
        </TableCell>
        <TableCell className='text-center text-sm font-semibold'>
          {formatCurrency(Number(payment.amount))}
        </TableCell>
        <TableCell className='text-center text-sm'>
          {payment.due_date ? (
            formatDate(payment.due_date)
          ) : (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='text-center'>
          <PaymentStatusBadge status={payment.status} />
        </TableCell>
        <TableCell className='text-center'>
          {payment.card_brand || payment.card_last4 ? (
            <div className='flex items-center justify-center gap-2'>
              {payment.card_brand && (
                <CardBrandLogo
                  brand={payment.card_brand}
                  className='flex size-8 shrink-0 items-center justify-center'
                />
              )}
              <span className='text-sm capitalize'>
                {payment.card_brand ?? 'Card'} ••••{' '}
                {payment.card_last4 ?? '----'}
              </span>
            </div>
          ) : (
            <span className='text-muted-foreground flex items-center justify-center gap-1 text-xs'>
              <CircleOff size={14} />
              Not Available
            </span>
          )}
        </TableCell>
        <TableCell className='text-center'>
          {payment.invoice_url ? (
            <a
              href={payment.invoice_url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary flex items-center justify-center'
            >
              <Download className='size-4' />
            </a>
          ) : (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center'>
            <Button
              variant='success'
              size='icon'
              className='rounded-lg'
              title={expanded ? 'Hide details' : 'See details'}
              onClick={() => setExpanded((prev) => !prev)}
            >
              <ChevronDown
                className={`transition-transform duration-200 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell
            colSpan={columnCount}
            className='bg-muted/30 px-6 pt-0 pb-4'
          >
            <div className='bg-background border-border mt-3 flex flex-col gap-3 rounded-xl border p-4'>
              <div className='flex items-start gap-3'>
                <div className='bg-warning/10 flex size-8 shrink-0 items-center justify-center rounded-lg'>
                  <Building2 className='text-warning size-3.5' />
                </div>
                <div>
                  <p className='text-muted-foreground text-[11px] font-semibold tracking-wider uppercase'>
                    Property
                  </p>
                  <p className='text-foreground mt-1 text-sm font-medium'>
                    {payment.property_name || (
                      <span className='text-muted-foreground font-normal'>
                        N/A
                      </span>
                    )}
                  </p>
                  {payment.property_address &&
                    payment.property_address !== payment.property_name && (
                      <p className='text-muted-foreground text-xs'>
                        {payment.property_address}
                      </p>
                    )}
                </div>
              </div>

              <hr className='m-0 border-black/10' />

              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg'>
                  <StickyNote className='text-primary size-3.5' />
                </div>
                <div>
                  <p className='text-muted-foreground text-[11px] font-semibold tracking-wider uppercase'>
                    Note
                  </p>
                  <p className='text-foreground mt-1 text-sm leading-relaxed whitespace-pre-wrap'>
                    {payment.note || (
                      <span className='text-muted-foreground font-normal'>
                        N/A
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default TenantPaymentTableRow;
