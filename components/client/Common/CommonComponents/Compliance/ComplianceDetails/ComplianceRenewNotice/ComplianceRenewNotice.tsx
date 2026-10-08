'use client';

import { ComplianceRenewNoticeProps } from '@/types/client/Common/Compliance/ComplianceTypes';
import { AlertCircle, Clock } from 'lucide-react';

const NOTICE_STYLES = {
  Expired: {
    icon: AlertCircle,
    container: 'border-danger/30 bg-danger/5',
    iconWrap: 'bg-danger/10 text-danger',
    title: 'This certificate has expired',
  },
  'Expiring Soon': {
    icon: Clock,
    container: 'border-warning/30 bg-warning/5',
    iconWrap: 'bg-warning/10 text-warning',
    title: 'This certificate is due for renewal',
  },
};

const ComplianceRenewNotice: React.FC<ComplianceRenewNoticeProps> = ({
  status,
  expiryText,
}) => {
  const { icon: Icon, container, iconWrap, title } = NOTICE_STYLES[status];

  return (
    <div
      className={`mb-6 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${container}`}
    >
      <div className='flex items-start gap-3'>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconWrap}`}
        >
          <Icon className='size-4' />
        </span>
        <div>
          <p className='text-foreground text-sm font-semibold'>
            {title} &middot; {expiryText}
          </p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            To renew, click <span className='font-medium'>Edit</span> and update
            the issue date, expiry date and certificate document with the new
            certificate details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceRenewNotice;
