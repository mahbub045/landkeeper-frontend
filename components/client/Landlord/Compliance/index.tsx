'use client';

import { Button } from '@/components/ui/button';

import {
  certificates,
  complianceBreakdown,
  upcomingExpirations,
} from '@/data/client/Landlord/compliance/ComplianceData';
import { Plus } from 'lucide-react';
import CertificateRegistry from './CertificateRegistry/CertificateRegistry';
import ComplianceScore from './ComplianceScore/ComplianceScore';
import UpcomingExpirations from './UpcomingExpirations/UpcomingExpirations';

const COMPLIANCE_SCORE = 87;

const CompliancePageContainer: React.FC = () => {
  const validCount = certificates.filter((c) => c.status === 'Valid').length;
  const totalCount = certificates.length;

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Compliance &amp; Certifications
          </h1>
          <p className='text-muted-foreground text-sm'>
            Track certificates and regulatory requirements
          </p>
        </div>
        <Button>
          <Plus />
          Add Certificate
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <ComplianceScore
          percent={COMPLIANCE_SCORE}
          validCount={validCount}
          totalCount={totalCount}
          breakdown={complianceBreakdown}
        />
        <UpcomingExpirations items={upcomingExpirations} />
      </div>

      <CertificateRegistry certificates={certificates} />
    </div>
  );
};

export default CompliancePageContainer;
