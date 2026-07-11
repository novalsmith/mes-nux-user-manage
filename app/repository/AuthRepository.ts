import type { AuthTokens, User } from '../model/AuthModel';

export interface AuthRepository {
   login(username: string, password: string): Promise<AuthTokens>;
  // exchangeCodeForToken(code: string, codeVerifier: string): Promise<AuthTokens>;
  getCurrentUser(token: string): Promise<User>;
}