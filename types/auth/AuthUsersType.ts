export interface AuthUser {
  user: {
    alias: string;
    profile_image: string | null;
    title: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
  };
  role: string;
}
