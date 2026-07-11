import type { AuthTokens, User } from '../model/AuthModel';

export interface AuthRepository {
   getAuthorizationUrl(): Promise<string> | string;
  exchangeCodeForToken(code: string, codeVerifier: string): Promise<AuthTokens>;
  getCurrentUser(token: string): Promise<User>;
}