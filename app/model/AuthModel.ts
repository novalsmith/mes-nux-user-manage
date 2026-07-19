// app/model/AuthModel.ts

/**
 * ============================
 * User
 * ============================
 */
export interface User {

  id: string;

  roles: string[];

  permissions: Record<string, boolean>;

  email?: string;

  profile?: string;

  preferred_username?: string;

  name?: string;

  avatar?: string;

  birthdate?: string | null;

}

/**
 * ============================
 * OAuth Tokens
 * ============================
 */
export interface AuthTokens {

  accessToken: string;

  refreshToken: string;

  expiresIn: number;

}

/**
 * ============================
 * Login Request
 * ============================
 */
export interface LoginRequest {

  username: string;

  password: string;

}

/**
 * ============================
 * Register Request
 * ============================
 */
export interface RegisterRequest {

  /**
   * Core User
   */
  username: string;

  email: string;

  password: string;

  /**
   * Profile
   */
  fullName: string;

  phone: string;

  address: string;

  /**
   * Date
   * Format:
   * yyyy-MM-dd
   */
  birthDate: string;

  weddingDate?: string | null;

  baptismDate?: string | null;

  /**
   * Dropdown
   */
  gender: Gender;

  familyRelation: FamilyRelation;

  /**
   * Taxonomy
   * target_id
   */
  jabatan?: number | null;

  /**
   * User Reference
   */
  parent?: number | null;

  /**
   * Optional
   */
  emergencyContact?: string;

  occupation?: string;

  /**
   * Profile Picture
   */
  picture?: File | null;

}

/**
 * ============================
 * OAuth Response
 * ============================
 */
export interface OAuthTokenResponse {

  access_token: string;

  refresh_token: string;

  expires_in: number;

  token_type: string;

}

/**
 * ============================
 * Gender
 * ============================
 */
export type Gender =

    | 'laki_laki'

    | 'female';

/**
 * ============================
 * Family Relation
 * ============================
 */
export type FamilyRelation =

    | 'kepala_keluarga'

    | 'istri'

    | 'anak'

    | 'anggota_lain';