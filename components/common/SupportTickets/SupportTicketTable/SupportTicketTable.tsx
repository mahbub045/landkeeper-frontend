'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  SupportTicketRowProps,
  SupportTicketTableProps,
} from '@/types/common/SupportTickets/SupportTicketTypes';

import {
  TABLE_COLUMNS,
  TICKET_TYPE_STYLES,
} from '@/data/common/SupportTickets/SupportTicketsData';
import formatChoiceFieldValue, { formatDate } from '@/utils/formatters';
import { getSupportTicketDetailsUrl } from '@/utils/redirectPath';
import {
  MessageSquareWarning,
  Paperclip,
  Pencil,
  Search,
  Trash,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import HoverInfoPopover from '../../HoverInfoPopover/HoverInfoPopover';
import DeleteSupportTicketDialog from '../Dialogs/DeleteSupportTicketDialog';
import UpdateSupportTicketDialog from '../Dialogs/UpdateSupportTicketDialog';

const SupportTicketRow: React.FC<SupportTicketRowProps> = ({
  ticket,
  apiTicket,
  idx,
}) => {
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <TableRow className='text-center'>
      <TableCell className='text-primary'>
        <Link
          href={getSupportTicketDetailsUrl(session, ticket.alias)}
          className='underline-offset-4 hover:underline'
        >
          {ticket.ticketId}
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          variant='secondary'
          className={`rounded-md font-medium ${TICKET_TYPE_STYLES[ticket.ticketType]}`}
        >
          {formatChoiceFieldValue(ticket.ticketType)}
        </Badge>
      </TableCell>
      <TableCell className='text-foreground max-w-45 truncate text-center text-sm font-medium'>
        {ticket.subject}
      </TableCell>
      <TableCell>
        <div className='flex items-center justify-center gap-3'>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-foreground text-sm font-semibold'>
              {ticket.createdByName}
            </p>
            <p className='text-muted-foreground text-xs'>
              {ticket.createdByEmail}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className='text-muted-foreground text-sm'>
        {ticket.fileCount > 0 ? (
          <span className='inline-flex items-center gap-1'>
            <Paperclip className='size-3.5' />
            {ticket.fileCount}
          </span>
        ) : (
          '—'
        )}
      </TableCell>
      <TableCell className='text-muted-foreground text-sm'>
        {formatDate(ticket.createdAt) || 'Not Available'}
      </TableCell>
      <TableCell>
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-lg'
            onClick={() => setEditOpen(true)}
          >
            <Pencil />
          </Button>
          <Button
            variant='destructive'
            size='icon'
            className='rounded-lg'
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
  );
};

const SupportTicketTable: React.FC<SupportTicketTableProps> = ({
  tickets,
  apiTickets,
  search,
  onSearchChange,
  isLoading,
}) => {
  const apiTicketByAlias = new Map(apiTickets.map((t) => [t.alias, t]));

  return (
    <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
      <div className='border-border flex items-center justify-between gap-1 border-b px-6 py-4'>
        <h2 className='text-foreground text-base font-semibold'>
          All Support Tickets
        </h2>
        <div className='flex items-center gap-1'>
          <div className='relative w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search tickets...'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className='h-9! w-64 rounded-xl pr-8! pl-7!'
            />
            <HoverInfoPopover text='You can search using Ticket ID, Ticket creator Name, Email and Phone.' />
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col}
                  className='px-6 text-center text-xs font-extrabold tracking-wider uppercase'
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={TABLE_COLUMNS.length} className='p-0'>
                  <div className='space-y-3 p-6'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className='h-14 w-full rounded-xl' />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : tickets.length > 0 ? (
              tickets.map((ticket, idx) => {
                const apiTicket = apiTicketByAlias.get(ticket.alias);
                if (!apiTicket) return null;
                return (
                  <SupportTicketRow
                    key={ticket.alias}
                    ticket={ticket}
                    apiTicket={apiTicket}
                    idx={idx}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={TABLE_COLUMNS.length}
                  className='py-16 text-center'
                >
                  <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
                    <MessageSquareWarning className='size-10' />
                    <span className='text-sm'>No support tickets found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default SupportTicketTable;
