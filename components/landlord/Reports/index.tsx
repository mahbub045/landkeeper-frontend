'use client';

import ReportList from './ReportList/ReportList';

const ReportContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Reports
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Generate and export portfolio reports
        </p>
      </div>

      {/* Grid */}
      <ReportList />
    </div>
  );
};

export default ReportContainer;
