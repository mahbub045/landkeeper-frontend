'use client';

import Properties from '@/components/client/Common/CommonComponents/Properties/Properties';
import { baseApi } from '@/store/api/baseApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLandlordAlias } from '@/store/slices/landlordAliasSlice';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { useEffect } from 'react';

const PropertiesTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const dispatch = useAppDispatch();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );

  useEffect(() => {
    dispatch(setLandlordAlias(landlord_alias));

    return () => {
      dispatch(setLandlordAlias(null));
      // Cached property data belongs to this landlord's organisation; drop it
      // so another landlord (or the admin's own view) never sees it.
      dispatch(
        baseApi.util.invalidateTags([
          'Property',
          'Permissions',
          'CommonPermissions',
        ]),
      );
    };
  }, [dispatch, landlord_alias]);

  // Wait until the header is in place so the first requests carry it
  if (landlordAlias !== landlord_alias) return null;

  return <Properties />;
};

export default PropertiesTab;
