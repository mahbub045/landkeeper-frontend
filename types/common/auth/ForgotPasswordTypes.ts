export interface ForgotPasswordApiError {
  data: {
    email?: string;
    detail?: string;
    message?: string;
  };
}
