export interface PropertyPermissionListProps {
  propertyAlias: string;
}
export interface PropertyPermissionUser {
  profile_image: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface PropertyPermission {
  alias: string;
  user: PropertyPermissionUser;
  property: string;
  mortgage: string | null;
  can_view: boolean;
  can_edit: boolean;
}

export interface PropertyPermissionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyPermission[];
}

export interface AddUserFromPropertyPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyAlias?: string;
}

export interface DeleteUserFromPropertyPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userToRemove: PropertyPermission | null;
}
