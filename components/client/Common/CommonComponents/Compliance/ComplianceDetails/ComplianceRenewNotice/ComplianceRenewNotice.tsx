'use client';

import {
  ALERT_SEVERITY_STYLES,
  getAlertSeverity,
} from '@/data/client/Common/Dashboard/DashboardData';
import { ComplianceRenewNoticeProps } from '@/types/client/Common/Compliance/ComplianceTypes';

const NOTICE_TITLES = {
  Expired: 'This certificate has expired',
  'Expiring Soon': 'This certificate is due for renewal',
};

const ComplianceRenewNotice: React.FC<ComplianceRenewNoticeProps> = ({
  status,
  expiryText,
  daysUntilExpiry,
}) => {
  // Same severity styles as the dashboard's Alerts & Reminders rows
  const {
    icon: Icon,
    iconBg,
    iconColor,
    titleColor,
  } = ALERT_SEVERITY_STYLES[getAlertSeverity(daysUntilExpiry)];

  return (
    <div className='border-border mb-6 flex items-start gap-3 rounded-xl border p-3 shadow-sm'>
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`size-4 ${iconColor}`} />
      </span>
      <div>
        <p className='text-foreground text-sm font-semibold'>
          {NOTICE_TITLES[status]} &middot;{' '}
          <span className={titleColor}>{expiryText}</span>
        </p>
        <p className='text-muted-foreground mt-0.5 text-xs'>
          To renew, click <span className='font-medium'>Edit</span> and update
          the issue date, expiry date and certificate document with the new
          certificate details.
        </p>
      </div>
    </div>
  );
};

export default ComplianceRenewNotice;
