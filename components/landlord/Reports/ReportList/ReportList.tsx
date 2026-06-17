'use client';

import { reports } from "@/data/landlord/reports/ReportsData";
import { Report } from "@/types/landlord/Reports/ReportsType";

function ReportCard({ report }: { report: Report }) {
  return (
    <button className="flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all hover:border-gray-200 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-gray-600">
      {report.icon}
      <div>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {report.title}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {report.description}
        </p>
      </div>
    </button>
  );
}

export const ReportList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};
