'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { SupportTicketRowProps } from '@/types/common/SupportTickets/SupportTicketTypes';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_CONTROL_OPTIONS,
  STATUS_ICON_COLORS,
  STATUS_ICONS,
  STATUS_LABELS,
  STATUS_STYLES,
  TABLE_COLUMNS,
  TICKET_TYPE_STYLES,
} from '@/data/common/SupportTickets/SupportTicketsData';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useUpdateSupportTicketsMutation } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import { getSupportTicketDetailsUrl } from '@/utils/redirectPath';
import {
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  MessageSquare,
  Paperclip,
  Pencil,
  Trash,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteSupportTicketDialog from '../../Dialogs/DeleteSupportTicketDialog';
import UpdateSupportTicketDialog from '../../Dialogs/UpdateSupportTicketDialog';

const SupportTicketTableRow: React.FC<SupportTicketRowProps> = ({
  ticket,
  apiTicket,
}) => {
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [updateSupportTickets, { isLoading: isStatusUpdating }] =
    useUpdateSupportTicketsMutation();

  const handleStatusChange = async (value: string) => {
    try {
      await updateSupportTickets({
        ticket_alias: ticket.alias,
        payload: { status: value },
      }).unwrap();
      toast.success('Ticket status updated successfully.');
    } catch (error) {
      toast.error('Failed to update ticket status. Please try again.');
    }
  };

  const { copy, isCopied } = useCopyToClipboard();

  return (
    <>
      <TableRow className='text-center'>
        <TableCell className='text-primary'>
          <div className='flex items-center justify-center gap-2'>
            <Link
              href={getSupportTicketDetailsUrl(session, ticket.alias)}
              className='text_decoration_hover'
            >
              {ticket.ticket_id}
            </Link>
            {session?.user?.role === 'SUPER_ADMIN' && (
              <button
                className='shrink-0 cursor-pointer rounded-md transition-colors'
                onClick={() =>
                  copy(ticket.alias as string, ticket.ticket_id, {
                    successMessage: 'Ticket ID copied to clipboard.',
                  })
                }
              >
                {isCopied(ticket.alias as string) ? (
                  <Check className='text-success size-3' />
                ) : (
                  <Copy className='text-primary size-3' />
                )}
              </button>
            )}
          </div>
        </TableCell>
        <TableCell>
          {session?.user?.role === 'SUPER_ADMIN' ? (
            <div className='flex justify-center'>
              <Select
                value={ticket.status}
                onValueChange={handleStatusChange}
                disabled={isStatusUpdating}
              >
                <SelectTrigger
                  className={`h-5.5! w-fit gap-1 rounded-md border-none px-2 py-0 text-xs font-medium shadow-none focus:ring-0 focus:ring-offset-0 [&_svg]:size-3 ${STATUS_STYLES[ticket.status]} `}
                >
                  <SelectValue>
                    <span className='flex items-center gap-1.5'>
                      {(() => {
                        const Icon = STATUS_ICONS[ticket.status];
                        return (
                          <Icon
                            className={`size-3 ${STATUS_ICON_COLORS[ticket.status]}`}
                          />
                        );
                      })()}
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align='center'>
                  {STATUS_CONTROL_OPTIONS.map((opt) => {
                    const Icon = STATUS_ICONS[opt.value];
                    return (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className='text-xs'
                      >
                        <span className='flex items-center gap-2'>
                          <Icon
                            className={`size-3.5 ${STATUS_ICON_COLORS[opt.value]}`}
                          />
                          {opt.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Badge
              variant='secondary'
              size='lg'
              className={`rounded-md text-xs font-medium ${STATUS_STYLES[ticket.status]}`}
            >
              <span className='flex items-center gap-1.5'>
                {(() => {
                  const Icon = STATUS_ICONS[ticket.status];
                  return (
                    <Icon
                      className={`size-3 ${STATUS_ICON_COLORS[ticket.status]}`}
                    />
                  );
                })()}
                {STATUS_LABELS[ticket.status]}
              </span>
            </Badge>
          )}
        </TableCell>
        <TableCell>
          <Badge
            variant='secondary'
            size='lg'
            className={`rounded-md font-medium ${TICKET_TYPE_STYLES[ticket.ticket_type]}`}
          >
            {formatChoiceFieldValue(ticket.ticket_type)}
          </Badge>
        </TableCell>

        <TableCell>
          <Badge
            variant='secondary'
            size='lg'
            className={`rounded-md font-medium ${PRIORITY_STYLES[ticket.priority]}`}
          >
            {PRIORITY_LABELS[ticket.priority]}
          </Badge>
        </TableCell>

        <TableCell className='text-muted-foreground max-w-12.5 truncate text-sm capitalize'>
          {ticket.subject || (
            <span className='text-muted-foreground font-normal'>N/A</span>
          )}
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center gap-3'>
            <div className='flex flex-col items-center justify-center'>
              <p className='text-foreground text-sm font-semibold'>
                {ticket.created_by.name}
              </p>
              <p className='text-muted-foreground text-xs'>
                {ticket.created_by.email}
              </p>
              {ticket.created_by.role && (
                <p className='text-muted-foreground text-xs'>
                  ({formatChoiceFieldValue(ticket.created_by.role)})
                </p>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className='text-muted-foreground text-sm'>
          {ticket.files.length > 0 ? (
            <span className='inline-flex items-center gap-1'>
              <Paperclip className='size-3.5' />
              {ticket.files.length}
            </span>
          ) : (
            '—'
          )}
        </TableCell>
        <TableCell className='text-muted-foreground text-sm'>
          {formatDateAndTime(ticket.created_at) || 'Not Available'}
        </TableCell>
        <TableCell>
          <div className='flex items-center justify-center gap-2'>
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
            <Button
              variant='default'
              size='icon'
              className='rounded-lg'
              title='Edit'
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            <Button
              variant='danger'
              size='icon'
              className='rounded-lg'
              title='Delete'
              onClick={() => setDeleteOpen(true)}
            >
              <Trash />
            </Button>
          </div>

          <UpdateSupportTicketDialog
            key={apiTicket.alias}
            open={editOpen}
            onClose={() => setEditOpen(false)}
            onSuccess={() => setEditOpen(false)}
            ticket={apiTicket}
          />

          <DeleteSupportTicketDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onSuccess={() => setDeleteOpen(false)}
            ticketAlias={ticket.alias}
          />
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell
            colSpan={TABLE_COLUMNS.length}
            className='bg-muted/30 px-6 pt-0 pb-4'
          >
            <div className='bg-background border-border mt-3 flex flex-col gap-3 rounded-xl border p-4'>
              {/* Subject */}
              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg'>
                  <Bookmark className='text-primary size-3.5' />
                </div>
                <div>
                  <p className='text-muted-foreground text-[11px] font-semibold tracking-wider uppercase'>
                    Subject
                  </p>
                  <p className='text-foreground mt-1 text-sm font-medium capitalize'>
                    {ticket.subject || (
                      <span className='text-muted-foreground font-normal'>
                        N/A
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <hr className='m-0 border-black/60' />

              {/* Message */}
              <div className='flex items-start gap-3'>
                <div className='bg-success/10 flex size-8 shrink-0 items-center justify-center rounded-lg'>
                  <MessageSquare className='text-success size-3.5' />
                </div>
                <div className='flex-1'>
                  <p className='text-muted-foreground text-[11px] font-semibold tracking-wider uppercase'>
                    Message
                  </p>
                  <p className='text-secondary mt-1 text-sm leading-relaxed whitespace-pre-wrap'>
                    {ticket.description || <span>N/A</span>}
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

export default SupportTicketTableRow;
