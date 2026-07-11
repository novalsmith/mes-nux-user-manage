import type { AuthRepository } from '../repository/AuthRepository';
import type { AuthDatasource } from '../implementation/Auth';
import type { AuthTokens, User } from '../model/AuthModel';

// services/AuthService.ts
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private datasource: AuthDatasource, private config: any) {}

  // Sudah tidak membutuhkan getAuthorizationUrl karena tidak ada redirect

  async login(username: string, password: string): Promise<AuthTokens> {
    const data = await this.datasource.loginWithCredentials(username, password);
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    };
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await this.datasource.fetchMe(token);
    if (!response) return { id: '', roles: [], permissions: {} };
    return {
      id: response.id,
      roles: response.roles || [], 
      permissions: response.permissions || {},
      email: response.email,
      profile: response.profile,
      preferred_username: response.preferred_username,
      name: response.name
    };
  }
}