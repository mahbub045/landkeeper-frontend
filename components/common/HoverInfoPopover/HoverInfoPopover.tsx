'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info, Search } from 'lucide-react';
import { useState } from 'react';

interface HoverInfoPopoverProps {
  text?: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';
}

function HoverInfoPopover({
  text,
  content,
  icon,
  triggerClassName = 'absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full',
  contentClassName = 'w-72 p-3',
  align = 'end',
}: HoverInfoPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`${triggerClassName} outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none`}
        >
          {icon ?? <Info className='size-3' />}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={contentClassName}
        align={align}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {content ?? (
          <p className='text-muted-foreground flex items-start gap-2 text-sm'>
            <Search className='mt-0.5 size-4 shrink-0' />
            <small>{text}</small>
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default HoverInfoPopover;
