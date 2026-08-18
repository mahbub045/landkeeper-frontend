export interface MortgagePermissionListProps {
  mortgageAlias: string;
}
export interface MortgagePermissionUser {
  profile_image: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface MortgagePermission {
  alias: string;
  user: MortgagePermissionUser;
  can_view: boolean;
  can_edit: boolean;
}

export interface MortgagePermissionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MortgagePermission[];
}

export interface AddUserFromMortgagePermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mortgageAlias?: string;
}

export interface DeleteUserFromMortgagePermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userToRemove: MortgagePermission | null;
}
