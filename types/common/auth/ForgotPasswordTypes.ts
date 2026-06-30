export interface ForgotPasswordApiError {
  data: {
    email?: string;
    detail?: string;
    message?: string;
  };
}
export interface SetPasswordApiError {
  data: {
    new_password?: string | string[];
    confirm_password?: string | string[];
    detail?: string;
    message?: string;
  };
}
