import FinancialOverview from './FinancialOverview/FinancialOverview';
import PropertyAndTenancyDetails from './PropertyAndTenancyDetails/PropertyAndTenancyDetails';

const TenantDashboardContainer: React.FC = () => {
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <PropertyAndTenancyDetails />
        <FinancialOverview />
      </div>
    </>
  );
};

export default TenantDashboardContainer;
