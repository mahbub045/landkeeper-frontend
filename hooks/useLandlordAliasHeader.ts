'use client';

import { baseApi } from '@/store/api/baseApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLandlordAlias } from '@/store/slices/landlordAliasSlice';
import { useEffect } from 'react';

/** /super-admin/landlords/<alias>/… — pages acting on one landlord */
const LANDLORD_SCOPED_PATH = /^\/super-admin\/landlords\/[^/]+/;

/**
 * Super admin viewing a landlord's data: sends `X-LANDLORD-ALIAS` on every
 * API request while the calling component is mounted.
 *
 * Returns `true` once the header is in place — render the data-fetching
 * children only then, so their first requests carry it.
 */
export function useLandlordAliasHeader(landlord_alias: string): boolean {
  const dispatch = useAppDispatch();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );

  // Also re-applies if another screen's cleanup cleared it during navigation
  useEffect(() => {
    if (landlord_alias && landlordAlias !== landlord_alias) {
      // Drop data cached for a previous landlord. Done here (not on unmount)
      // because the children aren't rendered yet: unsubscribed entries are
      // just removed, nothing refetches without the header.
      dispatch(
        baseApi.util.invalidateTags([
          'Property',
          'Permissions',
          'CommonPermissions',
        ]),
      );
      dispatch(setLandlordAlias(landlord_alias));
    }
  }, [dispatch, landlord_alias, landlordAlias]);

  useEffect(() => {
    return () => {
      // Moving between this landlord's screens (e.g. property details → back
      // to the Properties tab) unmounts one and mounts the next in the same
      // commit; the next screen's requests would go out without the header.
      // Only clear once we've left the landlord's pages entirely.
      if (!LANDLORD_SCOPED_PATH.test(window.location.pathname)) {
        dispatch(setLandlordAlias(null));
      }
    };
  }, [dispatch, landlord_alias]);

  return !!landlord_alias && landlordAlias === landlord_alias;
}
