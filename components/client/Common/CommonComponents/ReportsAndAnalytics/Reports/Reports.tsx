'use client';

import type { FC } from 'react';

import ComplianceReport from './ComplianceReport/ComplianceReport';
import ExpenseReport from './ExpenseReport/ExpenseReport';
import IncomeReport from './IncomeReport/IncomeReport';
import MortgageSummaryReport from './MortgageSummaryReport/MortgageSummaryReport';
import PortfolioSummaryReport from './PortfolioSummaryReport/PortfolioSummaryReport';
import TaxPreparationReport from './TaxPreparationReport/TaxPreparationReport';

const Reports: FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      <PortfolioSummaryReport />
      <IncomeReport />
      <ExpenseReport />
      <ComplianceReport />
      <TaxPreparationReport />
      <MortgageSummaryReport />
    </div>
  );
};

export default Reports;
