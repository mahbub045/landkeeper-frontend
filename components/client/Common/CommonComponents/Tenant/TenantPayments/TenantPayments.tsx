'use client';
import { useGetTenantPaymentsQuery } from '@/store/api/endpoints/client/Common/Tenant/TenantPaymentsApi';

const TenantPayments: React.FC = () => {
  const {
    data: tenantPayments,
    isLoading,
    isError,
  } = useGetTenantPaymentsQuery(undefined);

  return <div>{/* JSX here */} Test</div>;
};

export default TenantPayments;
