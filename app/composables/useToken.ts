// app/composables/useToken.ts

import type { AuthTokens } from '~/model/AuthModel';

export const useToken = () => {

  const accessToken = useCookie<string | null>(
    'auth_token',
  );

  const refreshToken = useCookie<string | null>(
    'refresh_token',
  );

  const saveTokens = (
    tokens: AuthTokens,
  ) => {

    accessToken.value = tokens.accessToken;

    refreshToken.value = tokens.refreshToken;

  };

  const clearTokens = () => {

    accessToken.value = null;

    refreshToken.value = null;

  };

  return {

    accessToken,

    refreshToken,

    saveTokens,

    clearTokens,

  };

};