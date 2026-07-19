// app/composables/useAuth.ts

import { computed, ref } from 'vue';

import { AuthDatasource } from '~/infrastructure/drupal/Auth';
import { AuthService } from '~/services/AuthService';
import { useAuthState } from '~/composables/useAuthState';

import { FetchError } from 'ofetch';

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from '~/model/AuthModel';

export const useAuth = () => {

  const datasource = new AuthDatasource();
  const authService = new AuthService(datasource);

  const { user, setUser, clearAuth } = useAuthState();

  /**
   * Cookie Access Token
   */
  const accessToken = useCookie<string | null>(
    'auth_token',
    {
      maxAge: 60 * 60 * 24,
    },
  );

  /**
   * Cookie Refresh Token
   */
  const refreshToken = useCookie<string | null>(
    'refresh_token',
    {
      maxAge: 60 * 60 * 24 * 14,
    },
  );

  const loading = ref(false);

  const errorMessage = ref('');

  /**
   * Login
   */
  const executeLogin = async (
    request: LoginRequest,
  ): Promise<User | null> => {

    loading.value = true;

    errorMessage.value = '';

    try {

      const tokens =
        await authService.login(request);

      /**
       * Simpan kedua token
       */
      accessToken.value =
        tokens.accessToken;

      refreshToken.value =
        tokens.refreshToken;

      /**
       * Ambil User
       */
      const currentUser =
        await authService.getCurrentUser(
          tokens.accessToken,
        );

      setUser(currentUser);

      return currentUser;

    } catch (error: any) {

      console.error(error);

      errorMessage.value =
        error.message ??
        'Login gagal';

      return null;

    } finally {

      loading.value = false;

    }

  };

  /**
   * Refresh Access Token
   */
  const refreshAccessToken =
    async (): Promise<boolean> => {

      if (!refreshToken.value) {

        return false;

      }

      try {

        const tokens =
          await authService.refresh(
            refreshToken.value,
          );

        accessToken.value =
          tokens.accessToken;

        refreshToken.value =
          tokens.refreshToken;

        return true;

      } catch {

        logout();

        return false;

      }

    };

  /**
   * Register
   */
const executeRegister = async (
  request: RegisterRequest,
): Promise<boolean> => {

  loading.value = true;

  errorMessage.value = '';

  try {

    await $fetch(
      '/api/auth/register',
      {
        method: 'POST',
        body: request,
      },
    );

    return true;

  } catch (error: any) {

    errorMessage.value =
      error?.data?.message ??
      error?.message ??
      'Registrasi gagal.';

    return false;

  } finally {

    loading.value = false;

  }

};

  const buildRegisterFormData = (
  request: RegisterRequest,
): FormData => {

  const form = new FormData();

  form.append(
    'username',
    request.username,
  );

  form.append(
    'email',
    request.email,
  );

  form.append(
    'password',
    request.password,
  );

  form.append(
    'fullName',
    request.fullName,
  );

  form.append(
    'phone',
    request.phone,
  );

  form.append(
    'address',
    request.address,
  );

  form.append(
    'birthDate',
    request.birthDate,
  );

  form.append(
    'gender',
    request.gender,
  );

  form.append(
    'familyRelation',
    request.familyRelation,
  );

  if (request.weddingDate) {

    form.append(
      'weddingDate',
      request.weddingDate,
    );

  }

  if (request.baptismDate) {

    form.append(
      'baptismDate',
      request.baptismDate,
    );

  }

  if (request.occupation) {

    form.append(
      'occupation',
      request.occupation,
    );

  }

  if (request.emergencyContact) {

    form.append(
      'emergencyContact',
      request.emergencyContact,
    );

  }

  if (request.jabatan !== null && request.jabatan !== undefined) {

    form.append(
      'jabatan',
      request.jabatan.toString(),
    );

  }

  if (request.parent !== null && request.parent !== undefined) {

    form.append(
      'parent',
      request.parent.toString(),
    );

  }

  if (request.picture) {

    form.append(
      'picture',
      request.picture,
      request.picture.name,
    );

  }

  return form;

};

  /**
   * Logout
   */
  const logout = () => {

    accessToken.value = null;

    refreshToken.value = null;

    clearAuth();

    navigateTo('/login');

  };

  return {

    user: computed(() => user.value),

    isLoggedIn: computed(
      () => !!accessToken.value,
    ),

    loading,

    errorMessage,

    executeLogin,

    executeRegister,

    refreshAccessToken,

    logout,

  };

};