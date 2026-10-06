import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  STATUS_CONTROL_OPTIONS,
  STATUS_DESCRIPTIONS,
  STATUS_ICON_COLORS,
  STATUS_ICONS,
  STATUS_LABELS,
  TABLE_COLUMNS,
} from '@/data/common/SupportTickets/SupportTicketsData';
import { HelpCircle } from 'lucide-react';

const SupportTicketTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        {TABLE_COLUMNS.map((col) => (
          <TableHead
            key={col}
            className='px-6 text-center font-semibold tracking-wider'
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
  );
};

export default SupportTicketTableHeader;
