// app/repository/AuthRepository.ts

import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
} from '~/model/AuthModel';

export interface AuthRepository {
  /**
   * Login menggunakan username & password.
   */
  login(request: LoginRequest): Promise<AuthTokens>;

  /**
   * Mengambil informasi user yang sedang login.
   */
  getCurrentUser(token: string): Promise<User>;

  /**
   * Registrasi user baru.
   */
  register(request: RegisterRequest): Promise<boolean>;
}