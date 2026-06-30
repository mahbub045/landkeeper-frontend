import { Session } from 'next-auth';

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

  //   If no role found
  return '/auth/login';
};
