# Role-Based Access Control (RBAC) Usage Guide

## Overview

This project now has a complete RBAC system with 3 roles and role-based paths:
- **ADMIN**: Full access to all features at `/admin/*`
- **LANDLORD**: Access to property management features at `/client/*`
- **TENANT**: Limited access to dashboard, documents, and settings at `/client/*`

## Test Credentials

| Email               | Password  | Role      | Dashboard URL       |
|---------------------|-----------|-----------|---------------------|
| rahat@admin.com     | admin     | ADMIN     | `/admin/dashboard`  |
| super@test.com      | super123  | LANDLORD  | `/client/dashboard` |
| user@test.com       | user123   | TENANT    | `/client/dashboard` |

## Role-Based Paths

### Automatic Redirection
- Visiting `/` automatically redirects to the appropriate dashboard based on role
- ADMIN users are redirected from `/client/*` to `/admin/dashboard`
- Non-ADMIN users are redirected from `/admin/*` to `/client/dashboard`

### Path Structure
- **Admin Paths**: `/admin/dashboard`, `/admin/parcels`, `/admin/settings`, etc.
- **Client Paths**: `/client/dashboard`, `/client/applications`, `/client/settings`, etc.

## Using RoleGuard Component

### Basic Usage with Allowed Roles

```tsx
import RoleGuard from '@/components/auth/RoleGuard';

<RoleGuard allowedRoles={['ADMIN', 'LANDLORD']}>
  <button>Delete Property</button>
</RoleGuard>
```

### With Required Minimum Role

```tsx
import RoleGuard from '@/components/auth/RoleGuard';

<RoleGuard requireRole="LANDLORD">
  <div>Landlord-only content</div>
</RoleGuard>
```

### With Fallback

```tsx
import RoleGuard from '@/components/auth/RoleGuard';

<RoleGuard 
  allowedRoles={['ADMIN']} 
  fallback={<p>You don't have permission to view this</p>}
>
  <div>Admin-only content</div>
</RoleGuard>
```

### Using IfHasRole Helper

```tsx
import { IfHasRole } from '@/components/auth/RoleGuard';

<IfHasRole roles={['ADMIN']}>
  <button>Admin Button</button>
</IfHasRole>
```

## Using Role Utility Functions

```tsx
import { 
  hasPermission, 
  hasHigherOrEqualRole,
  hasRoutePermission,
  getRoleDisplayName,
  getBasePathForRole,
  getDashboardPathForRole
} from '@/lib/roles';

// Check if user has specific role
if (hasPermission(userRole, ['ADMIN', 'LANDLORD'])) {
  // do something
}

// Check if user has role or higher
if (hasHigherOrEqualRole(userRole, 'LANDLORD')) {
  // do something
}

// Check route permission (for specific paths)
if (hasRoutePermission(userRole, '/admin/parcels')) {
  // allow access
}

// Get display name
console.log(getRoleDisplayName('ADMIN')); // "Administrator"

// Get base path for role
console.log(getBasePathForRole('ADMIN')); // "/admin"
console.log(getBasePathForRole('LANDLORD')); // "/client"

// Get dashboard path for role
console.log(getDashboardPathForRole('TENANT')); // "/client/dashboard"
```

## Using Role-Based Navigation

```tsx
import { getRoleBasedPath } from '@/lib/navigation';

// Get the correct path for the user's role
const parcelsPath = getRoleBasedPath(userRole, '/parcels');
// Returns "/admin/parcels" for ADMIN, "/client/parcels" for others
```

## Adding Role Restrictions to Navigation

Edit `lib/navigation.ts`:

```tsx
export const mainNavItems: NavItem[] = [
  { 
    title: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    roles: ['ADMIN', 'LANDLORD', 'TENANT'] 
  },
  { 
    title: 'Properties', 
    path: '/parcels', 
    icon: Home, 
    roles: ['ADMIN', 'LANDLORD'] 
  },
];
```

## Route Permissions

Current route permissions are defined in:
- `lib/roles.ts` - For utility functions
- `middleware.ts` - For server-side protection

## How It Works

1. **Login**: User logs in with credentials
2. **Role Assignment**: User gets their role from the session
3. **Automatic Redirection**: After login, user is redirected to `/` which automatically sends them to the right dashboard
4. **Navigation**: Sidebar only shows items the user has permission to see
5. **Route Protection**: Middleware ensures users can't access paths outside their role's base path

