'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SUPPORT_TICKET_STATUS_OPTIONS } from '@/data/common/ChoiceFieldOptions';
import {
  PRIORITY_STYLES,
  STATUS_DESCRIPTIONS,
  STATUS_ICON_COLORS,
  STATUS_ICONS,
  STATUS_LABELS,
  STATUS_STYLES,
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
  Download,
  FileText,
  FileX,
  HelpCircle,
  ImageIcon,
  MessageSquareText,
  Paperclip,
  Pencil,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import CustomErrorMessage from '../../CustomErrorMessage/CustomErrorMessage';
import DetailsCopyId from '../../DetailsPage/DetailsCopyId';
import DetailsEmptyState from '../../DetailsPage/DetailsEmptyState';
import DetailsPageHeader from '../../DetailsPage/DetailsPageHeader';
import DetailsSection from '../../DetailsPage/DetailsSection';
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
  } = useGetSupportTicketDetailsQuery({ ticket_alias: ticketalias });

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-36 w-full rounded-2xl' />
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <Skeleton className='h-64 rounded-2xl lg:col-span-2' />
          <div className='space-y-6'>
            <Skeleton className='h-32 rounded-2xl' />
            <Skeleton className='h-48 rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ticketDetails) {
    return <CustomErrorMessage title='support ticket Details' />;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <DetailsPageHeader
        eyebrow='Support ticket'
        title={ticketDetails.subject}
        actions={
          <Button onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit Ticket
          </Button>
        }
        meta={
          <>
            <DetailsCopyId
              copyKey={ticketDetails.alias as string}
              value={ticketDetails.ticket_id}
              label='Ticket ID'
            />
            <div className='flex items-center gap-1.5'>
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
                      {SUPPORT_TICKET_STATUS_OPTIONS.map((opt) => {
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
                      {SUPPORT_TICKET_STATUS_OPTIONS.map((opt) => {
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
            <Badge
              variant='secondary'
              className={`rounded-md font-medium ${TICKET_TYPE_STYLES[ticketDetails.ticket_type]}`}
            >
              {formatChoiceFieldValue(ticketDetails.ticket_type)}
            </Badge>
            <Badge
              variant='secondary'
              className={`rounded-md text-xs font-medium ${PRIORITY_STYLES[ticketDetails.priority]}`}
            >
              {formatChoiceFieldValue(ticketDetails.priority)} priority
            </Badge>
          </>
        }
      />

      {/* Description + Sidebar */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <DetailsSection
          title='Ticket Description'
          icon={MessageSquareText}
          className='lg:col-span-2'
        >
          <div className='border-primary max-h-96 overflow-y-auto border-l-2 pl-4'>
            <p className='text-foreground text-sm leading-relaxed whitespace-pre-line'>
              {ticketDetails.description}
            </p>
          </div>
        </DetailsSection>

        <div className='space-y-6'>
          <DetailsSection title='Created by' icon={User}>
            <div className='flex items-center gap-3'>
              <Avatar className='size-11'>
                <AvatarImage
                  src={ticketDetails.created_by.profile_image || ''}
                  alt={ticketDetails.created_by.name}
                />
                <AvatarFallback className='text-sm font-bold'>
                  {getInitials(ticketDetails.created_by.name)}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0'>
                <p className='text-foreground truncate text-sm font-semibold'>
                  {ticketDetails.created_by.name}
                </p>
                <p className='text-muted-foreground truncate text-xs'>
                  {ticketDetails.created_by.email}
                </p>
                <p className='text-muted-foreground text-xs'>
                  Created {formatDate(ticketDetails.created_at)}
                </p>
              </div>
            </div>
          </DetailsSection>

          <DetailsSection
            title='Attachments'
            icon={Paperclip}
            action={
              <span className='bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium'>
                {ticketDetails.files.length}
              </span>
            }
          >
            {ticketDetails.files.length === 0 ? (
              <DetailsEmptyState
                icon={FileX}
                message='No attachments.'
                className='py-6'
              />
            ) : (
              <ul className='max-h-96 space-y-3 overflow-y-auto'>
                {ticketDetails.files.map((f) => {
                  const filename = getFileName(f.file);
                  return (
                    <li
                      key={f.alias}
                      className='bg-muted/40 flex items-center gap-3 rounded-xl border px-3 py-2.5'
                    >
                      <span className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg'>
                        {isPdf(filename) ? (
                          <FileText className='size-4' />
                        ) : (
                          <ImageIcon className='size-4' />
                        )}
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p className='text-foreground truncate text-sm font-medium'>
                          {filename}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {isPdf(filename) ? 'PDF document' : 'Image'}
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        size='icon'
                        className='shrink-0 rounded-lg'
                        asChild
                      >
                        <a
                          href={f.file}
                          download
                          target='_blank'
                          rel='noopener noreferrer'
                          aria-label={`Download ${filename}`}
                        >
                          <Download />
                        </a>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </DetailsSection>
        </div>
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
