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
    </div>
  );
};

export default MortgageAdviserDashboardContainer;
