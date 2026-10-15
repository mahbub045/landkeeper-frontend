export {};

declare global {
  interface Window {
    Affonso?: {
      signup: (
        emailOrUser: string | {
          email?: string;
          externalUserId?: string;
          name?: string;
        }
      ) => void;
    };
  }
}
