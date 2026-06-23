'use client';

import ReportList from './ReportList/ReportList';

const ReportContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Reports
        </h1>
        <p className='text-muted-foreground text-sm'>
          Generate and export portfolio reports
        </p>
      </div>
      <ReportList />
    </div>
  );
};

export default ReportContainer;
