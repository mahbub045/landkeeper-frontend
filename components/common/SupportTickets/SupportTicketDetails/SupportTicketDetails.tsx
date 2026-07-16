'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PRIORITY_STYLES,
  STATUS_DESCRIPTIONS,
  STATUS_ICON_COLORS,
  STATUS_ICONS,
  STATUS_LABELS,
  STATUS_STYLES,
  StatusOptions,
  TICKET_TYPE_STYLES,
} from '@/data/common/SupportTickets/SupportTicketsData';
import {
  useGetSupportTicketDetailsQuery,
  useUpdateSupportTicketsMutation,
} from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import formatChoiceFieldValue, {
  formatDate,
  getInitials,
} from '@/utils/formatters';
import {
  ArrowLeft,
  Download,
  FileText,
  HelpCircle,
  ImageIcon,
  Pencil,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import HoverInfoPopover from '../../HoverInfoPopover/HoverInfoPopover';
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
  const { data: session } = useSession();
  const { ticketalias } = useParams<{ ticketalias: string }>();
  const [editOpen, setEditOpen] = useState(false);

  const [updateSupportTickets, { isLoading: isStatusUpdating }] =
    useUpdateSupportTicketsMutation();

  const handleStatusChange = async (value: string) => {
    try {
      await updateSupportTickets({
        ticket_alias: ticketalias,
        payload: { status: value },
      }).unwrap();
      toast.success('Ticket status updated successfully.');
    } catch (error) {
      // console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status. Please try again.');
    }
  };

  const {
    data: ticketDetails,
    isLoading,
    isError,
    refetch,
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

  if (isError || !ticketDetails) {
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
        <div className='justify-centre flex items-center gap-2'>
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
              {ticketDetails.subject}
            </h2>

            <div className='flex items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>Ticket Type:</span>
              <Badge
                variant='secondary'
                className={`rounded-md font-medium ${TICKET_TYPE_STYLES[ticketDetails.ticket_type]}`}
              >
                {formatChoiceFieldValue(ticketDetails.ticket_type)}
              </Badge>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <span className='text-muted-foreground'>Priority:</span>
              <Badge
                variant='secondary'
                className={`rounded-md text-xs font-medium ${PRIORITY_STYLES[ticketDetails.priority]}`}
              >
                {formatChoiceFieldValue(ticketDetails.priority)}
              </Badge>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Avatar className='size-12'>
              <AvatarImage
                src={ticketDetails.created_by.profile_image || ''}
                alt={ticketDetails.created_by.name}
              />
              <AvatarFallback className='text-sm font-bold'>
                {getInitials(ticketDetails.created_by.name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col items-start'>
              <p className='text-muted-foreground text-xs'>Created by</p>
              <p className='text-foreground text-sm font-semibold'>
                {ticketDetails.created_by.name}
              </p>
              <p className='text-muted-foreground text-xs'>
                {ticketDetails.created_by.email}
              </p>
              <p className='text-muted-foreground text-xs'>
                Created: {formatDate(ticketDetails.created_at)}
              </p>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2'>
            <div className='flex items-center justify-center gap-2'>
              {session?.user?.role === 'SUPER_ADMIN' ? (
                <div className='flex justify-center'>
                  <Select
                    value={ticketDetails.status}
                    onValueChange={handleStatusChange}
                    disabled={isStatusUpdating}
                  >
                    <SelectTrigger
                      className={`h-5.5! w-fit gap-1 rounded-md border-none px-2 py-0 text-xs font-medium shadow-none focus:ring-0 focus:ring-offset-0 [&_svg]:size-3 ${STATUS_STYLES[ticketDetails.status]} `}
                    >
                      <SelectValue>
                        <span className='flex items-center gap-1.5'>
                          {(() => {
                            const Icon = STATUS_ICONS[ticketDetails.status];
                            return (
                              <Icon
                                className={`size-3 ${STATUS_ICON_COLORS[ticketDetails.status]}`}
                              />
                            );
                          })()}
                          {STATUS_LABELS[ticketDetails.status]}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent align='center'>
                      {StatusOptions.map((opt) => {
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
                  className={`rounded-md text-xs font-medium ${STATUS_STYLES[ticketDetails.status]}`}
                >
                  <span className='flex items-center gap-1.5'>
                    {(() => {
                      const Icon = STATUS_ICONS[ticketDetails.status];
                      return (
                        <Icon
                          className={`size-3 ${STATUS_ICON_COLORS[ticketDetails.status]}`}
                        />
                      );
                    })()}
                    {STATUS_LABELS[ticketDetails.status]}
                  </span>
                </Badge>
              )}

              <div className='bg-warning rounded-md p-0.5'>
                <HoverInfoPopover
                  icon={<HelpCircle className='size-3.5 text-white' />}
                  triggerClassName='flex size-4 items-center justify-center rounded-full'
                  contentClassName='w-80 space-y-2 p-4 normal-case'
                  align='center'
                  content={
                    <>
                      {StatusOptions.map((opt) => {
                        const Icon = STATUS_ICONS[opt.value];
                        return (
                          <div
                            key={opt.value}
                            className='flex items-start gap-2'
                          >
                            <Icon
                              className={`mt-0.5 size-3.5 shrink-0 ${STATUS_ICON_COLORS[opt.value]}`}
                            />
                            <p className='text-muted-foreground text-xs'>
                              <span
                                className={`font-semibold ${STATUS_ICON_COLORS[opt.value]}`}
                              >
                                {STATUS_LABELS[opt.value]}:
                              </span>{' '}
                              {STATUS_DESCRIPTIONS[opt.value]}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  }
                />
              </div>
            </div>
            <div className='bg-primary/10 rounded-lg px-4 py-2 text-right'>
              <p className='text-muted-foreground text-xs font-semibold'>
                Ticket ID
              </p>
              <p className='text-primary text-sm font-bold'>
                {ticketDetails.ticket_id}
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
              {ticketDetails.description}
            </p>
          </div>
        </Card>

        <Card className='border-border rounded-2xl p-6 shadow-sm'>
          <h2 className='text-foreground mb-4 text-base font-semibold'>
            Attachments ({ticketDetails.files.length})
          </h2>

          {ticketDetails.files.length === 0 ? (
            <p className='text-muted-foreground text-sm'>No attachments.</p>
          ) : (
            <ul className='space-y-3'>
              {ticketDetails.files.map((f) => {
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

      <SupportTicketComments ticketAlias={ticketDetails.alias} />

      <UpdateSupportTicketDialog
        key={ticketDetails.alias}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        ticket={ticketDetails}
      />
    </div>
  );
};

export default SupportTicketDetails;
