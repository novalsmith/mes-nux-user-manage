// app/infrastructure/drupal/Auth.ts

import type {
  LoginRequest,
  RegisterRequest,
  OAuthTokenResponse,
  AuthTokens,
  User,
} from '~/model/AuthModel';

export class AuthDatasource {

  /**
   * Login
   */
  async login(
    request: LoginRequest,
  ): Promise<OAuthTokenResponse> {

    return await $fetch<OAuthTokenResponse>(
      '/api/auth/token',
      {
        method: 'POST',
        body: request,
      },
    );

  }

  /**
   * Refresh Access Token
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<AuthTokens> {

    return await $fetch<AuthTokens>(
      '/api/auth/refresh',
      {
        method: 'POST',

        body: {
          refreshToken,
        },
      },
    );

  }

  /**
   * User Profile
   */
  async fetchMe(
    accessToken: string,
  ): Promise<User> {

    return await $fetch<User>(
      '/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

  }

  /**
   * Register
   */
  async register(
    request: RegisterRequest,
  ): Promise<void> {

    await $fetch(
      '/api/auth/register',
      {
        method: 'POST',
        body: request,
      },
    );

  }

}