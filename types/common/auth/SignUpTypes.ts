export type SignupFieldErrors = Partial<
  Record<
    | 'title'
    | 'first_name'
    | 'middle_name'
    | 'last_name'
    | 'email'
    | 'phone'
    | 'password'
    | 'non_field_errors',
    string[]
  >
>;