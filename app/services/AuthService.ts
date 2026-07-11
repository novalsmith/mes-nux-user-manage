import type { AuthRepository } from '../repository/AuthRepository';
import type { AuthDatasource } from '../implementation/Auth';
import type { AuthTokens, User } from '../model/AuthModel';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private datasource: AuthDatasource,
    private config: any
  ) {}

  // UBAH: Jadikan method ini async karena harus mengambil data dari API Server Nuxt
  async getAuthorizationUrl(): Promise<string> {
    try {
      const data: any = await $fetch('/api/auth/authorize');
      return data.url;
    } catch (error) {
      console.error('Gagal mendapatkan URL otorisasi dari server:', error);
      throw error;
    }
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<AuthTokens> {
    const data = await this.datasource.exchangeCode(code, codeVerifier);
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
    id: response.id,               // Mengambil nilai "1"
    roles: response.roles || [], 
    permissions: response.permissions || {},
    email: response.email,
    profile: response.profile,
    preferred_username: response.preferred_username,
    name: response.name
  };
  }
}