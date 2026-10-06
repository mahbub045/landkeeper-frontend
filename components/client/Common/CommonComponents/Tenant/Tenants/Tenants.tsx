import TenantList from './TenantList/TenantList';
import TanentSummary from './TenantSummary/TanentSummary';

const Tenants: React.FC = () => {
  return (
    <div className='space-y-6'>
      <TanentSummary />
      <TenantList />
    </div>
  );
};

export default Tenants;
