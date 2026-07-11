export interface User {
  id: string;
  roles: string[];
  permissions: Record<string, boolean>;
  email?: string;
  profile?: string;
  preferred_username?:string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}