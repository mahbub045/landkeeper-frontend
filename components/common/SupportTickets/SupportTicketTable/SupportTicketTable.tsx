'use client';

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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  MultiSelectFilterProps,
  SupportTicketTableProps,
} from '@/types/common/SupportTickets/SupportTicketTypes';

import {
  PriorityOptions,
  StatusOptions,
  TABLE_COLUMNS,
  TicketTypeOptions,
} from '@/data/common/SupportTickets/SupportTicketsData';
import { ChevronDown, MessageSquareWarning, Search } from 'lucide-react';
import { useState } from 'react';
import HoverInfoPopover from '../../HoverInfoPopover/HoverInfoPopover';
import SupportTicketTableHeader from './SupportTicketTableHeader/SupportTicketTableHeader';
import SupportTicketTableRow from './SupportTicketTableRow/SupportTicketTableRow';

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
          {/* Table Header */}
          <SupportTicketTableHeader />

          {/* Table Body */}
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
                  // Table Body row
                  <SupportTicketTableRow
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
