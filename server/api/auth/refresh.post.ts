// server/api/auth/refresh.post.ts

import { FetchError } from 'ofetch';

interface RefreshTokenRequest {
  refreshToken: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RefreshTokenRequest>(event);
  const config = useRuntimeConfig();

  if (!body.refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Refresh token is required.',
    });
  }

  const formData = new URLSearchParams();

  formData.append('grant_type', 'refresh_token');
  formData.append('client_id', config.public.oauthClientId);
  formData.append('client_secret', config.oauthClientSecret);
  formData.append('refresh_token', body.refreshToken);

  try {
    const response = await $fetch<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    }>(
      `${config.public.drupalBaseUrl}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
        body: formData,
      },
    );

    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    };

  } catch (error) {

    if (error instanceof FetchError) {

      const errorData =
        error.response?._data ?? {};

      throw createError({

        statusCode:
          error.response?.status ?? 401,

        statusMessage:
          'Refresh Token Failed',

        message:
          errorData.message ??
          errorData.error_description ??
          'Refresh token tidak valid.',

      });

    }

    throw error;

  }

});