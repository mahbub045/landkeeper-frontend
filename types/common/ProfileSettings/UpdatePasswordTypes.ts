import { ProfileInfo } from './SettingsTypes';

export interface UpdatePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  profileData: ProfileInfo;
}

interface ApiErrorData {
  detail?: string;
  message?: string;
  errors?: Record<string, string | string[]> | string[] | string;
}

export interface ApiError {
  data: ApiErrorData;
}

export interface SetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}
