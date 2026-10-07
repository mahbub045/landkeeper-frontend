import PropertyTypesChart from '../../Common/CommonComponents/Dashboard/DashboardCharts/PropertyTypesChart/PropertyTypesChart';
import DashboardStats from './DashboardStats/DashboardStats';

const MortgageAdviserDashboardContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground text-sm'>
          Complete overview of all land management activity.
        </p>
      </div>

      <DashboardStats />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <PropertyTypesChart />
      </div>
    </div>
  );
};

export default MortgageAdviserDashboardContainer;
