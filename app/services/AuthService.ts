// app/services/AuthService.ts

import { AuthDatasource } from '~/infrastructure/drupal/Auth';

import type { AuthRepository } from '~/repository/AuthRepository';

import type {
  AuthTokens,
  LoginRequest,
  OAuthTokenResponse,
  RegisterRequest,
  User,
} from '~/model/AuthModel';

export class AuthService implements AuthRepository {

  constructor(
    private readonly datasource: AuthDatasource,
  ) {}

  /**
   * Login
   */
  async login(
    request: LoginRequest,
  ): Promise<AuthTokens> {

    const response: OAuthTokenResponse =
      await this.datasource.login(request);

    return this.mapTokens(response);

  }

  /**
   * Refresh Access Token
   */
  async refresh(
    refreshToken: string,
  ): Promise<AuthTokens> {

    return await this.datasource.refreshToken(
      refreshToken,
    );

  }

  /**
   * Current User
   */
  async getCurrentUser(
    accessToken: string,
  ): Promise<User> {

    const response =
      await this.datasource.fetchMe(accessToken);

    return {

      id: response.id,

      roles: response.roles ?? [],

      permissions:
        response.permissions ?? {},

      email: response.email,

      profile: response.profile,

      preferred_username:
        response.preferred_username,

      name: response.name,

      avatar: response.avatar,

      birthdate:
        response.birthdate ?? null,

    };

  }

  /**
   * Register
   */
  async register(
    request: RegisterRequest,
  ): Promise<boolean> {

    await this.datasource.register(request);

    return true;

  }

  /**
   * Mapping OAuth Response
   */
  private mapTokens(
    response: OAuthTokenResponse,
  ): AuthTokens {

    return {

      accessToken:
        response.access_token,

      refreshToken:
        response.refresh_token,

      expiresIn:
        response.expires_in,

    };

  }

}