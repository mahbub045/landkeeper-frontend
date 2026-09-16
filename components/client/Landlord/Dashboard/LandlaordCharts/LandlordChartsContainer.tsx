import AlertsReminders from './AlertsReminders/AlertsReminders';
import ComplianceTypesCard from './ComplianceTypesCard/ComplianceTypesCard';
import IncomeExpensesChart from './IncomeExpensesChart/IncomeExpensesChart';
import PropertyTypesChart from './PropertyTypesChart/PropertyTypesChart';

const LandlordChartsContainer: React.FC = () => {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
      <IncomeExpensesChart />
      <AlertsReminders />
      <PropertyTypesChart />
      <ComplianceTypesCard />
    </div>
  );
};

export default LandlordChartsContainer;
