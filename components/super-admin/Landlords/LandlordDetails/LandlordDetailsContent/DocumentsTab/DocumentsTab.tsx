'use client';

import DocumentsAndTemplates from '@/components/client/Common/CommonComponents/DocumentsAndTemplates/DocumentsAndTemplates';
import { useLandlordAliasHeader } from '@/hooks/useLandlordAliasHeader';
import { CommonLandlordAliasProps } from '@/types/super-admin/Landlords/Overview/OverviewType';

const DocumentsTab: React.FC<CommonLandlordAliasProps> = ({
  landlord_alias,
}) => {
  const isHeaderReady = useLandlordAliasHeader(landlord_alias);

  // Wait until the header is in place so the first requests carry it
  if (!isHeaderReady) return null;

  return <DocumentsAndTemplates />;
};

export default DocumentsTab;
