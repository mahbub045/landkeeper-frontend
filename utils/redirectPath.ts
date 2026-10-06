import { UserRole } from '@/types/next-auth';
import { Session } from 'next-auth';

export function getDashboardPath(role: UserRole | undefined): string {
  const paths: Record<UserRole, string> = {
    SUPER_ADMIN: '/super-admin/dashboard',
    LANDLORD: '/client/landlord/dashboard',
    ADMIN: '/client/admin/dashboard',
    LETTING_AGENT: '/client/letting-agent/dashboard',
    MORTGAGE_ADVISER: '/client/mortgage-adviser/dashboard',
    // TENANT: '/client/tenant/dashboard',
    TENANT: '/client/tenant/rent-and-payments',
  };
  return role && paths[role] ? paths[role] : '/auth/access-denied';
}

// All user Property List
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's properties)
export const getPropertiesUrl = (
  session: Session | null,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  //   Super Admin → the landlord's details page (Properties tab)
  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}`
      : '/super-admin/landlords';
  }

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
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's property)
export const getPropertyDetailsUrl = (
  session: Session | null,
  propertyalias: string,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}/properties/${propertyalias}`
      : '/super-admin/landlords';
  }

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
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's mortgages)
export const getMortgageUrl = (
  session: Session | null,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  //   Super Admin → the landlord's details page (Mortgages tab)
  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}`
      : '/super-admin/landlords';
  }

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
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's mortgage)
export const getMortgageDetailsUrl = (
  session: Session | null,
  mortgagealias: string,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}/mortgages/${mortgagealias}`
      : '/super-admin/landlords';
  }

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
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's compliance)
export const getComplianceUrl = (
  session: Session | null,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  //   Super Admin → the landlord's details page (Compliance tab)
  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}`
      : '/super-admin/landlords';
  }

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

// All users Compliance Details Page
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's certificate)
export const getComplianceDetailsUrl = (
  session: Session | null,
  complianceAlias: string,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}/compliance/${complianceAlias}`
      : '/super-admin/landlords';
  }

  if (role === 'LANDLORD') {
    return `/client/landlord/compliance/${complianceAlias}`;
  }

  if (role === 'ADMIN') {
    return `/client/admin/compliance/${complianceAlias}`;
  }

  if (role === 'LETTING_AGENT') {
    return `/client/letting-agent/compliance/${complianceAlias}`;
  }

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

    case 'COMPLIANCE_CERTIFICATE':
      if (role === 'LANDLORD') {
        return `/client/landlord/compliance/${data.alias}`;
      }

      if (role === 'ADMIN') {
        return `/client/admin/compliance/${data.alias}`;
      }

      if (role === 'LETTING_AGENT') {
        return `/client/letting-agent/compliance/${data.alias}`;
      }
      return '#';

    default:
      return '#';
  }
};

// All users Property maintenance request Details Page
// `landlordAlias` is required for SUPER_ADMIN (viewing a landlord's request)
export const getPropertyMaintenanceDetailsUrl = (
  session: Session | null,
  maintenanceAlias: string,
  landlordAlias?: string | null,
) => {
  if (!session) {
    return '/auth/login';
  }

  const role = session?.user?.role;
  if (!role) return '/auth/login';

  if (role === 'SUPER_ADMIN') {
    return landlordAlias
      ? `/super-admin/landlords/${landlordAlias}/property-maintenance/${maintenanceAlias}`
      : '/super-admin/landlords';
  }

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
