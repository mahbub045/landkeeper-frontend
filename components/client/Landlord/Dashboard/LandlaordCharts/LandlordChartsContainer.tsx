import AlertsReminders from './AlertsReminders/AlertsReminders';
import IncomeExpensesChart from './IncomeExpensesChart/IncomeExpensesChart';
import PortfolioDistribution from './PortfolioDistribution/PortfolioDistribution';
import RecentActivity from './RecentActivity/RecentActivity';

const LandlordChartsContainer: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
      <IncomeExpensesChart />
      <AlertsReminders />
      <RecentActivity />
      <PortfolioDistribution />
    </div>
  );
};

export default LandlordChartsContainer;
