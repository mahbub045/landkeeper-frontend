import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetPortfolioReportsMutation } from '@/store/api/endpoints/client/Common/ReportsAndAnalytics/ReportsApi';
import { Building2, FileSpreadsheet, FileText } from 'lucide-react';

type ExportFormat = 'xlsx' | 'pdf';

const EXPORT_OPTIONS: {
  format: ExportFormat;
  label: string;
  icon: React.ElementType;
}[] = [
  { format: 'xlsx', label: 'Export as Excel (.xlsx)', icon: FileSpreadsheet },
  { format: 'pdf', label: 'Export as PDF (.pdf)', icon: FileText },
];

const PortfolioSummaryReport: React.FC = () => {
  const [getPortfolioReports, { isLoading }] = useGetPortfolioReportsMutation();

  const handleExport = async (format: ExportFormat) => {
    try {
      const response = await getPortfolioReports({
        export_format: format,
      }).unwrap();

      // Assuming the endpoint returns a blob (file) response.
      // Make sure the RTK Query endpoint uses responseHandler: (res) => res.blob()
      const blob = response instanceof Blob ? response : new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-summary.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export portfolio report:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          className='h-auto w-full p-0 hover:bg-transparent'
          disabled={isLoading}
        >
          <Card className='border-border w-full cursor-pointer shadow-md transition-all hover:shadow-md'>
            <CardContent className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
              {isLoading ? (
                <Loading />
              ) : (
                <Building2 className='text-blue-500' />
              )}
              <div>
                <p className='text-foreground text-base font-bold'>
                  Portfolio Summary
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Complete overview of all properties
                </p>
              </div>
            </CardContent>
          </Card>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' className='w-56'>
        {EXPORT_OPTIONS.map(({ format, label, icon: Icon }) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={isLoading}
            className='cursor-pointer'
          >
            <Icon className='mr-2 h-4 w-4' />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PortfolioSummaryReport;
