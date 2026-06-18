'use client';

import { Card, CardContent } from '@/components/ui/card';
import { reports } from '@/data/landlord/reports/ReportsData';
import { Report } from '@/types/landlord/Reports/ReportsType';

function ReportCard({ report }: { report: Report }) {
  return (
    <Card className='cursor-pointer border-border shadow-sm transition-all hover:shadow-md'>
      <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
        {report.icon}
        <div>
          <p className='text-base font-bold text-foreground'>{report.title}</p>
          <p className='mt-1 text-sm text-muted-foreground'>{report.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const ReportList: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};

export default ReportList;