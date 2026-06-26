'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PropertyDangerZoneProps {
  onDeleteClick: () => void;
}

const PropertyDangerZone: React.FC<PropertyDangerZoneProps> = ({
  onDeleteClick,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <Card className='border-destructive/40 rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-destructive flex items-center gap-2 text-base font-semibold'>
          <AlertTriangle className='size-4' />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 px-5 pb-5'>
        <Separator className='bg-destructive/20' />
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-foreground text-sm font-medium'>
              Delete property
            </p>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              Permanently removes this property and all associated data. This
              cannot be undone.
            </p>
          </div>
          {!deleteConfirm ? (
            <Button
              variant='destructive'
              size='sm'
              className='shrink-0'
              onClick={() => setDeleteConfirm(true)}
            >
              <Trash2 className='size-3.5' />
              Delete
            </Button>
          ) : (
            <div className='flex shrink-0 items-center gap-2'>
              <span className='text-muted-foreground text-xs'>Sure?</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => {
                  setDeleteConfirm(false);
                  onDeleteClick();
                }}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDangerZone;
