"use client";

import type { UserRole } from "@/types/next-auth";
import { useSession } from "next-auth/react";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 1,
  LANDLORD: 2,
  MORTGAGE_ADVISER: 3,
  ACCOUNTANT: 4,
  LETTING_AGENT: 5,
};

function hasPermission(
  userRole: UserRole | undefined,
  requiredRoles: UserRole[],
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

function hasHigherOrEqualRole(
  userRole: UserRole | undefined,
  requiredRole: UserRole,
): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireRole?: UserRole;
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  requireRole,
  fallback = null,
}: RoleGuardProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  if (!userRole) {
    return <>{fallback}</>;
  }

  if (allowedRoles && !hasPermission(userRole, allowedRoles)) {
    return <>{fallback}</>;
  }

  if (requireRole && !hasHigherOrEqualRole(userRole, requireRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface IfHasRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
}

export function IfHasRole({ children, roles }: IfHasRoleProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  if (!userRole || !hasPermission(userRole, roles)) {
    return null;
  }

  return <>{children}</>;
}
