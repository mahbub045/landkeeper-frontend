import AlertsReminders from './AlertsReminders/AlertsReminders';
import IncomeExpensesChart from './IncomeExpensesChart/IncomeExpensesChart';
import PropertyTypesChart from './PropertyTypesChart/PropertyTypesChart';
import RecentActivity from './RecentActivity/RecentActivity';

const LandlordChartsContainer: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
      <IncomeExpensesChart />
      <AlertsReminders />
      <PropertyTypesChart />
      <RecentActivity />
    </div>
  );
};

export default LandlordChartsContainer;
