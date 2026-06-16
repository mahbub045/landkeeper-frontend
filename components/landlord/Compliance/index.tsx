"use client";

import { Plus } from "lucide-react";
import CertificateRegistry from "./CertificateRegistry/CertificateRegistry";
import ComplianceScore from "./ComplianceScore/ComplianceScore";
import UpcomingExpirations from "./UpcomingExpirations/UpcomingExpirations";
import { certificates, complianceBreakdown, upcomingExpirations } from '@/data/landlord/compliance/ComplianceData';
const COMPLIANCE_SCORE = 87;

export default function CompliancePageContainer() {
  const validCount = certificates.filter((c) => c.status === "Valid").length;
  const totalCount = certificates.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Compliance &amp; Certifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track certificates and regulatory requirements
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <Plus className="size-4" />
          Add Certificate
        </button>
      </div>

      {/* Top two cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ComplianceScore
          percent={COMPLIANCE_SCORE}
          validCount={validCount}
          totalCount={totalCount}
          breakdown={complianceBreakdown}
        />
        <UpcomingExpirations items={upcomingExpirations} />
      </div>

      {/* Certificate Registry */}
      <CertificateRegistry certificates={certificates} />
    </div>
  );
}
