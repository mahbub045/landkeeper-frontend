'use client';

import {
  RENEW_NOTICE_BACKGROUNDS,
  RENEW_NOTICE_TITLES,
} from '@/data/client/Common/Compliance/ComplianceData';
import {
  ALERT_SEVERITY_STYLES,
  getAlertSeverity,
} from '@/data/client/Common/Dashboard/DashboardData';
import { ComplianceRenewNoticeProps } from '@/types/client/Common/Compliance/ComplianceTypes';

const ComplianceRenewNotice: React.FC<ComplianceRenewNoticeProps> = ({
  status,
  expiryText,
  daysUntilExpiry,
}) => {
  // Same severity styles as the dashboard's Alerts & Reminders rows
  const severity = getAlertSeverity(daysUntilExpiry);
  const {
    icon: Icon,
    iconBg,
    iconColor,
    titleColor,
  } = ALERT_SEVERITY_STYLES[severity];

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-xl border p-3 shadow-sm ${RENEW_NOTICE_BACKGROUNDS[severity]}`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`size-4 ${iconColor}`} />
      </span>
      <div>
        <p className='text-foreground text-sm font-semibold'>
          {RENEW_NOTICE_TITLES[status]} &middot;{' '}
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
