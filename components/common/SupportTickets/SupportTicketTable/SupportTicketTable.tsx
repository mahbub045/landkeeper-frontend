'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  MultiSelectFilterProps,
  SupportTicketRowProps,
  SupportTicketStatus,
  SupportTicketTableProps,
} from '@/types/common/SupportTickets/SupportTicketTypes';

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
  PriorityOptions,
  STATUS_DESCRIPTIONS,
  STATUS_ICON_COLORS,
  STATUS_ICONS,
  STATUS_LABELS,
  STATUS_STYLES,
  StatusOptions,
  TABLE_COLUMNS,
  TICKET_TYPE_STYLES,
  TicketTypeOptions,
} from '@/data/common/SupportTickets/SupportTicketsData';
import { useUpdateSupportTicketsMutation } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import { getSupportTicketDetailsUrl } from '@/utils/redirectPath';
import {
  Bookmark,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  MessageSquareWarning,
  Paperclip,
  Pencil,
  Search,
  Trash,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import HoverInfoPopover from '../../HoverInfoPopover/HoverInfoPopover';
import DeleteSupportTicketDialog from '../Dialogs/DeleteSupportTicketDialog';
import UpdateSupportTicketDialog from '../Dialogs/UpdateSupportTicketDialog';

const STATUS_CONTROL_OPTIONS: Array<{
  value: SupportTicketStatus;
  label: string;
}> = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as SupportTicketStatus,
  label,
}));

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selected,
  onChange,
  widthClassName = 'lg:w-40 xl:w-44',
}) => {
  const [open, setOpen] = useState(false);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const summaryLabel =
    selected.length === 0
      ? label
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? label)
        : `${label.replace('Filter by ', '')} (${selected.length})`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={`h-9! w-full justify-between rounded-md font-normal ring-offset-0 focus:ring-0 focus:ring-offset-0 ${widthClassName} ${
            selected.length > 0 ? 'border-primary/40' : ''
          }`}
        >
          <span
            className={`truncate ${
              selected.length === 0
                ? 'text-muted-foreground'
                : 'text-foreground'
            }`}
          >
            <span className='capitalize'>{summaryLabel}</span>
          </span>

          <ChevronDown className='text-muted-foreground size-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-56 p-2'
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className='max-h-64 space-y-0.5 overflow-y-auto'>
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className='hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm'
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleValue(opt.value)}
                />
                <span className='truncate'>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {selected.length > 0 && (
          <div className='border-border mt-2 flex justify-end border-t pt-2'>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 text-xs'
              onClick={() => onChange([])}
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const SupportTicketRow: React.FC<SupportTicketRowProps> = ({
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

  return (
    <>
      <TableRow className='text-center'>
        <TableCell className='text-primary'>
          <Link
            href={getSupportTicketDetailsUrl(session, ticket.alias)}
            className='text_decoration_hover'
          >
            {ticket.ticket_id}
          </Link>
        </TableCell>
        <TableCell>
          <Badge
            variant='secondary'
            className={`rounded-md font-medium ${TICKET_TYPE_STYLES[ticket.ticket_type]}`}
          >
            {formatChoiceFieldValue(ticket.ticket_type)}
          </Badge>
        </TableCell>

        <TableCell>
          <Badge
            variant='secondary'
            className={`rounded-md font-medium ${PRIORITY_STYLES[ticket.priority]}`}
          >
            {PRIORITY_LABELS[ticket.priority]}
          </Badge>
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
        <TableCell className='text-muted-foreground max-w-12.5 truncate text-sm'>
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
              variant='outline'
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
              variant='outline'
              size='icon'
              className='rounded-lg'
              title='Edit'
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            <Button
              variant='destructive'
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
                  <p className='text-foreground mt-1 text-sm font-medium'>
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

const SupportTicketTable: React.FC<SupportTicketTableProps> = ({
  supportTicketsData,
  search,
  onSearchChange,
  ticketTypeFilter,
  onTicketTypeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
  isLoading,
}) => {
  const apiTicketByAlias = new Map(supportTicketsData.map((t) => [t.alias, t]));

  return (
    <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
      <div className='border-border flex flex-col gap-3 border-b px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-1'>
        <h2 className='text-foreground text-base font-semibold'>
          All Support Tickets
        </h2>

        <div className='flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end'>
          {/* Filters: 2-col grid on mobile, row on larger screens */}
          <div className='grid grid-cols-2 gap-2 lg:flex lg:items-center'>
            <MultiSelectFilter
              label='Filter by ticket type'
              options={TicketTypeOptions}
              selected={ticketTypeFilter}
              onChange={onTicketTypeFilterChange}
            />

            <MultiSelectFilter
              label='Filter by priority'
              options={PriorityOptions}
              selected={priorityFilter}
              onChange={onPriorityFilterChange}
            />

            <div className='col-span-2 lg:col-span-1'>
              <MultiSelectFilter
                label='Filter by status'
                options={StatusOptions}
                selected={statusFilter}
                onChange={onStatusFilterChange}
              />
            </div>
          </div>

          <div className='relative w-full lg:w-56 xl:w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search tickets...'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className='h-9! w-full rounded-xl pr-8! pl-7!'
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
                  <div className='flex items-center justify-center gap-1'>
                    {col}
                    {col === 'Status' && (
                      <HoverInfoPopover
                        icon={<HelpCircle className='text-secondary size-4' />}
                        triggerClassName='flex size-4 items-center justify-center rounded-full'
                        contentClassName='w-80 space-y-2 p-4 normal-case'
                        align='center'
                        content={
                          <>
                            {STATUS_CONTROL_OPTIONS.map((opt) => {
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
                    )}
                  </div>
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
            ) : supportTicketsData.length > 0 ? (
              supportTicketsData.map((ticket, idx) => {
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
