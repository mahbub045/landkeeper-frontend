export interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ApiErrorData {
  detail?: string;
  message?: string;
  errors?: Record<string, string | string[]> | string[] | string;
}

export interface ApiError {
  data: ApiErrorData;
}
