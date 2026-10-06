import DashboardChartsContainer from '../../Common/CommonComponents/Dashboard/DashboardCharts/DashboardChartsContainer';
import DashboardStatsContainer from '../../Common/CommonComponents/Dashboard/DashboardStats/DashboardStatsContainer';

const AdminDashboardContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Dashboard
        </h1>
        <p className='text-muted-foreground text-sm'>
          Welcome back. Here&apos;s your portfolio overview.
        </p>
      </div>
      <DashboardStatsContainer />
      <DashboardChartsContainer />
    </div>
  );
};

export default AdminDashboardContainer;
