'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HOW_IT_WORKS_STEPS } from '@/data/super-admin/Marketplace/MarketplaceData';

interface HowItWorksDialogProps {
  open: boolean;
  onClose: () => void;
}

const HowItWorksDialog: React.FC<HowItWorksDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>How the Marketplace works</DialogTitle>
          <DialogDescription>
            Find vetted providers for your properties in three simple steps.
          </DialogDescription>
        </DialogHeader>

        <ol className='space-y-4'>
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <li key={step.title} className='flex gap-3'>
              <span className='bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
                {i + 1}
              </span>
              <div>
                <p className='text-foreground text-sm font-semibold'>
                  {step.title}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;
