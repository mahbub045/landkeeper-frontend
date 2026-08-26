import { UserRole } from '@/types/next-auth';
import { Session } from 'next-auth';

export function getDashboardPath(role: UserRole | undefined): string {
  const paths: Record<UserRole, string> = {
    SUPER_ADMIN: '/super-admin/dashboard',
    LANDLORD: '/client/landlord/dashboard',
    ADMIN: '/client/admin/dashboard',
    LETTING_AGENT: '/client/letting-agent/dashboard',
    MORTGAGE_ADVISER: '/client/mortgage-adviser/dashboard',
    TENANT: '/client/tenant/dashboard',
  };
  return role && paths[role] ? paths[role] : '/auth/access-denied';
}

// All user Property List
export const getPropertiesUrl = (session: Session | null) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  //   Landlord Property List
  if (role === 'LANDLORD') {
    return '/client/landlord/properties';
  }

  //   Admin Property List
  if (role === 'ADMIN') {
    return '/client/admin/properties';
  }

  //   Letting Agent Property List
  if (role === 'LETTING_AGENT') {
    return '/client/letting-agent/properties';
  }

  //   Mortgage Adviser Property List
  if (role === 'MORTGAGE_ADVISER') {
    return '/client/mortgage-adviser/properties';
  }

  //   If no role found
  return '/auth/login';
};

// All users Property Details Page
export const getPropertyDetailsUrl = (
  session: Session | null,
  propertyalias: string,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'LANDLORD') {
    return `/client/landlord/properties/${propertyalias}`;
  }

  if (role === 'ADMIN') {
    return `/client/admin/properties/${propertyalias}`;
  }

  if (role === 'LETTING_AGENT') {
    return `/client/letting-agent/properties/${propertyalias}`;
  }

  if (role === 'MORTGAGE_ADVISER') {
    return `/client/mortgage-adviser/properties/${propertyalias}`;
  }

  return '/auth/login';
};

// All users Mortgage List
export const getMortgageUrl = (session: Session | null) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  //   Landlord Property List
  if (role === 'LANDLORD') {
    return '/client/landlord/mortgages';
  }

  //   Admin Property List
  if (role === 'ADMIN') {
    return '/client/admin/mortgages';
  }

  //   Letting Agent Property List
  if (role === 'LETTING_AGENT') {
    return '/client/letting-agent/mortgages';
  }

  //   Mortgage Adviser Property List
  if (role === 'MORTGAGE_ADVISER') {
    return '/client/mortgage-adviser/mortgages';
  }

  //   If no role found
  return '/auth/login';
};

// All users Mortgage Details Page
export const getMortgageDetailsUrl = (
  session: Session | null,
  mortgagealias: string,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'LANDLORD') {
    return `/client/landlord/mortgages/${mortgagealias}`;
  }

  if (role === 'ADMIN') {
    return `/client/admin/mortgages/${mortgagealias}`;
  }

  if (role === 'LETTING_AGENT') {
    return `/client/letting-agent/mortgages/${mortgagealias}`;
  }

  if (role === 'MORTGAGE_ADVISER') {
    return `/client/mortgage-adviser/mortgages/${mortgagealias}`;
  }

  return '/auth/login';
};

// All users Compliance List
export const getComplianceUrl = (session: Session | null) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  //   Landlord Property List
  if (role === 'LANDLORD') {
    return '/client/landlord/compliance';
  }

  //   Admin Property List
  if (role === 'ADMIN') {
    return '/client/admin/compliance';
  }

  //   Letting Agent Property List
  if (role === 'LETTING_AGENT') {
    return '/client/letting-agent/compliance';
  }

  //   If no role found
  return '/auth/login';
};

// All users Property Details Page
export const getSupportTicketDetailsUrl = (
  session: Session | null,
  ticketalias: string,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'SUPER_ADMIN') {
    return `/super-admin/support-tickets/${ticketalias}`;
  }
  if (role === 'LANDLORD') {
    return `/client/landlord/support-tickets/${ticketalias}`;
  }

  if (role === 'ADMIN') {
    return `/client/admin/support-tickets/${ticketalias}`;
  }

  if (role === 'LETTING_AGENT') {
    return `/client/letting-agent/support-tickets/${ticketalias}`;
  }

  if (role === 'MORTGAGE_ADVISER') {
    return `/client/mortgage-adviser/support-tickets/${ticketalias}`;
  }

  return '/auth/login';
};

export const getStartNewJourneyUrl = (session: Session | null) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'LANDLORD') {
    return '/client/landlord/start-new-journey';
  }

  if (role === 'ADMIN') {
    return '/client/admin/start-new-journey';
  }

  if (role === 'LETTING_AGENT') {
    return '/client/letting-agent/start-new-journey';
  }

  return '/auth/login';
};

export const getNotificationURL = (
  session: Session | null,
  data?: { type: string; alias: string },
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (!data) return '#';

  switch (data.type) {
    case 'SUPPORT_TICKET':
      if (role === 'SUPER_ADMIN') {
        return `/super-admin/support-tickets/${data.alias}`;
      }

      if (role === 'LANDLORD') {
        return `/client/landlord/support-tickets/${data.alias}`;
      }

      if (role === 'ADMIN') {
        return `/client/admin/support-tickets/${data.alias}`;
      }

      if (role === 'LETTING_AGENT') {
        return `/client/letting-agent/support-tickets/${data.alias}`;
      }
      return '#';

    case 'MAINTENANCE_REQUEST':
      if (role === 'LANDLORD') {
        return `/client/landlord/property-maintenance/${data.alias}`;
      }

      if (role === 'ADMIN') {
        return `/client/admin/property-maintenance/${data.alias}`;
      }

      if (role === 'TENANT') {
        return `/client/tenant/maintenance-requests/${data.alias}`;
      }
      return '#';

    default:
      return '#';
  }
};

// All users Property maintenance request Details Page
export const getPropertyMaintenanceDetailsUrl = (
  session: Session | null,
  maintenanceAlias: string,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'LANDLORD') {
    return `/client/landlord/property-maintenance/${maintenanceAlias}`;
  }

  if (role === 'ADMIN') {
    return `/client/admin/property-maintenance/${maintenanceAlias}`;
  }

  // if (role === 'LETTING_AGENT') {
  //   return `/client/letting-agent/property-maintenance/${maintenanceAlias}`;
  // }

  // if (role === 'MORTGAGE_ADVISER') {
  //   return `/client/mortgage-adviser/property-maintenance/${maintenanceAlias}`;
  // }

  if (role === 'TENANT') {
    return `/client/tenant/maintenance-requests/${maintenanceAlias}`;
  }

  return '/auth/login';
};
