import LandlordChartsContainer from './LandlaordCharts/LandlordChartsContainer';
import LandlordStatsContainer from './LandlordStats/LandlordStatsContainer';

const LandlordDashboardContainer: React.FC = () => {
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
      <LandlordStatsContainer />
      <LandlordChartsContainer />
    </div>
  );
};

export default LandlordDashboardContainer;
