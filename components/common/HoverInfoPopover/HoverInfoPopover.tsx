import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info, Search } from 'lucide-react';
import { useState } from 'react';

function HoverInfoPopover({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className='absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full'
        >
          <Info className='size-3' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='w-72 p-3'
        align='end'
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <p className='text-muted-foreground flex items-start gap-2 text-sm'>
          <Search className='mt-0.5 size-4 shrink-0' />
          <small>{text}</small>
        </p>
      </PopoverContent>
    </Popover>
  );
}

export default HoverInfoPopover;
