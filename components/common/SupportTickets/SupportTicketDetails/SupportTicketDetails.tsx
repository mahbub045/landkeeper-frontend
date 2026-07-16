'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TICKET_TYPE_LABELS,
  TICKET_TYPE_STYLES,
} from '@/data/common/SupportTickets/SupportTicketsData';
import { useGetSupportTicketDetailsQuery } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';

import { formatDate, getInitials } from '@/utils/formatters';
import { ArrowLeft, Download, FileText, ImageIcon, Pencil } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import UpdateSupportTicketDialog from '../Dialogs/UpdateSupportTicketDialog';
import SupportTicketComments from './SupportTicketComments';

function getFileName(url: string) {
  try {
    return decodeURIComponent(url.split('/').pop() ?? 'file');
  } catch {
    return url.split('/').pop() ?? 'file';
  }
}

function isPdf(filename: string) {
  return filename.toLowerCase().endsWith('.pdf');
}

const SupportTicketDetails: React.FC = () => {
  const { ticketalias } = useParams<{ ticketalias: string }>();
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetSupportTicketDetailsQuery({ ticket_alias: ticketalias });

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-10 w-72' />
        <Skeleton className='h-32 w-full rounded-2xl' />
        <div className='grid grid-cols-3 gap-6'>
          <Skeleton className='col-span-2 h-64 rounded-2xl' />
          <Skeleton className='h-64 rounded-2xl' />
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <p className='text-danger text-sm'>
        Failed to load support ticket. Please try again.
      </p>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='flex justify-centre items-center gap-2'>
          <div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => window.history.back()}
              className='text-muted-foreground hover:text-foreground shrink-0'
            >
              <ArrowLeft className='size-5' />
            </Button>
          </div>

          <div>
            <h1 className='text-foreground text-2xl font-bold tracking-tight'>
              Support Ticket Details
            </h1>
            <p className='text-muted-foreground text-sm'>
              This is the support ticket details page
            </p>
          </div>
        </div>
        {/* Edit button */}
        <div className='flex justify-end'>
          <Button onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit Ticket Details
          </Button>
        </div>
      </div>

      {/* Overview card */}
      <Card className='border-border rounded-2xl p-6 shadow-sm'>
        <div className='flex items-start justify-between gap-6'>
          <div className='space-y-3'>
            <h2 className='text-foreground text-lg font-bold'>
              <span className='text-muted-foreground font-semibold'>
                Subject:
              </span>{' '}
              {ticket.subject}
            </h2>

            <div className='flex items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>Ticket Type:</span>
              <Badge
                variant='secondary'
                className={`rounded-md font-medium ${TICKET_TYPE_STYLES[ticket.ticket_type] ?? TICKET_TYPE_STYLES.OTHER}`}
              >
                {TICKET_TYPE_LABELS[ticket.ticket_type] ?? ticket.ticket_type}
              </Badge>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Avatar className='size-12'>
              <AvatarImage
                src={ticket.created_by.profile_image || ''}
                alt={ticket.created_by.name}
              />
              <AvatarFallback className='text-sm font-bold'>
                {getInitials(ticket.created_by.name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <p className='text-muted-foreground text-xs'>Created by</p>
              <p className='text-foreground text-sm font-semibold'>
                {ticket.created_by.name}
              </p>
              <p className='text-muted-foreground text-xs'>
                {ticket.created_by.email}
              </p>
              <p className='text-muted-foreground text-xs'>
                Created: {formatDate(ticket.created_at)}
              </p>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2'>
            <div className='bg-primary/10 rounded-lg px-4 py-2 text-right'>
              <p className='text-muted-foreground text-xs font-semibold'>
                Ticket ID
              </p>
              <p className='text-primary text-sm font-bold'>
                {ticket.ticket_id}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Description + Attachments */}
      <div className='grid grid-cols-3 gap-6'>
        <Card className='border-border col-span-2 rounded-2xl p-6 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-foreground text-base font-semibold'>
              Ticket Description
            </h2>
          </div>
          <div className='border-primary max-h-72 overflow-y-auto border-l-2 pl-4'>
            <p className='text-foreground text-sm whitespace-pre-line'>
              {ticket.description}
            </p>
          </div>
        </Card>

        <Card className='border-border rounded-2xl p-6 shadow-sm'>
          <h2 className='text-foreground mb-4 text-base font-semibold'>
            Attachments ({ticket.files.length})
          </h2>

          {ticket.files.length === 0 ? (
            <p className='text-muted-foreground text-sm'>No attachments.</p>
          ) : (
            <ul className='space-y-3'>
              {ticket.files.map((f) => {
                const filename = getFileName(f.file);
                return (
                  <li
                    key={f.alias}
                    className='bg-muted flex items-center gap-3 rounded-lg px-4 py-3'
                  >
                    {isPdf(filename) ? (
                      <FileText className='text-muted-foreground size-6 shrink-0' />
                    ) : (
                      <ImageIcon className='text-muted-foreground size-6 shrink-0' />
                    )}
                    <div className='min-w-0 flex-1'>
                      <p className='text-foreground truncate text-sm font-medium'>
                        {filename}
                      </p>
                      <a
                        href={f.file}
                        download
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-muted-foreground text-xs hover:underline'
                      >
                        Click to download
                      </a>
                    </div>
                    <a
                      href={f.file}
                      download
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Button
                        variant='outline'
                        size='icon'
                        className='rounded-lg'
                      >
                        <Download />
                      </Button>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <SupportTicketComments ticketAlias={ticket.alias} />

      <UpdateSupportTicketDialog
        key={ticket.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        ticket={ticket}
      />
    </div>
  );
};

export default SupportTicketDetails;
