'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MortgagePropertyType } from '@/types/client/Common/Mortgage/MortgageDetailsTypes';
import { getMortgageUrl } from '@/utils/redirectPath';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteMortgageDialog from '../../Dialogs/DeleteMortgageDialog';

const MortgageDangerZone: React.FC<{
  mortgage?: MortgagePropertyType;
}> = ({ mortgage }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <Card className='border-destructive/40 rounded-2xl shadow-lg'>
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
              Delete mortgage
            </p>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              Permanently removes this mortgage and all associated data. This
              cannot be undone.
            </p>
          </div>
          <Button
            variant='destructive'
            size='sm'
            className='shrink-0'
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className='size-3.5' />
            Delete
          </Button>
        </div>
      </CardContent>
      <DeleteMortgageDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getMortgageUrl(session))}
        mortgageAlias={mortgage?.alias ?? ''}
      />
    </Card>
  );
};

export default MortgageDangerZone;
