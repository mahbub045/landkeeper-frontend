'use client';

import DetailsDangerZone from '@/components/common/DetailsPage/DetailsDangerZone';
import { useAppSelector } from '@/store/hooks';
import { MortgagePropertyType } from '@/types/client/Common/Mortgage/MortgageDetailsTypes';
import { getMortgageUrl } from '@/utils/redirectPath';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteMortgageDialog from '../../Dialogs/DeleteMortgageDialog';

const MortgageDangerZone: React.FC<{
  mortgage?: MortgagePropertyType;
}> = ({ mortgage }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <DetailsDangerZone
        title='Delete mortgage'
        description='Permanently removes this mortgage and all associated data. This cannot be undone.'
        onDeleteClick={() => setDeleteOpen(true)}
      />
      <DeleteMortgageDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getMortgageUrl(session, landlordAlias))}
        mortgageAlias={mortgage?.alias ?? ''}
      />
    </>
  );
};

export default MortgageDangerZone;
