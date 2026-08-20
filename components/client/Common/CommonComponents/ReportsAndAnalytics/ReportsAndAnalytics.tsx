'use client';

import Reports from './Reports/Reports';

const ReportsAndAnalytics: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Reports and Analytics
        </h1>
        <p className='text-muted-foreground text-sm'>
          Generate and export portfolio reports
        </p>
      </div>
      <Reports />
    </div>
  );
};

export default ReportsAndAnalytics;
