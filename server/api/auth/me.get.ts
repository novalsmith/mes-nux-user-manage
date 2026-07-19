// server/api/auth/me.get.ts

import { FetchError } from 'ofetch';

interface OidcUserInfo {
  sub: string;
  id?: string;

  name?: string;
  email?: string;
  email_verified?: boolean;

  preferred_username?: string;

  roles?: string[];
  permissions?: Record<string, boolean>;

  profile?: string;
}

interface JsonApiFile {
  type: string;
  attributes?: {
    uri?: {
      url?: string;
    };
  };
}

interface JsonApiUser {
  attributes?: {
    display_name?: string;
    name?: string;
    mail?: string;
    field_birthdate?: string | null;
  };
}

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig();

  const authHeader = getHeader(event, 'authorization');

  if (!authHeader) {

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Missing access token.',
    });

  }

  try {

    /**
     * Ambil UserInfo dari OIDC
     */
    const oidc = await $fetch<OidcUserInfo>(
      `${config.public.drupalBaseUrl}/oauth/userinfo`,
      {
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
      },
    );

    const uid = oidc.sub ?? oidc.id;

    if (!uid) {

      throw createError({
        statusCode: 404,
        statusMessage: 'User tidak ditemukan.',
      });

    }

    /**
     * Ambil data lengkap User dari JSON:API
     */
    const jsonApi = await $fetch<{
      data: JsonApiUser[];
      included?: JsonApiFile[];
    }>(
      `${config.public.drupalBaseUrl}/jsonapi/user/user?filter[drupal_internal__uid]=${uid}&include=user_picture`,
      {
        headers: {
          Authorization: authHeader,
          Accept: 'application/vnd.api+json',
        },
      },
    );

    const user = jsonApi.data?.[0];

    if (!user) {

      throw createError({
        statusCode: 404,
        statusMessage: 'User tidak ditemukan.',
      });

    }

    /**
     * Cari avatar
     */
    let avatar: string | undefined;

    const file = jsonApi.included?.find(
      item => item.type === 'file--file',
    );

    if (file?.attributes?.uri?.url) {

      avatar =
        `${config.public.drupalBaseUrl}${file.attributes.uri.url}`;

    }

    /**
     * Mapping response
     */
    return {

      id: uid,

      name:
        oidc.name ??
        user.attributes?.display_name,

      email:
        oidc.email ??
        user.attributes?.mail,

      preferred_username:
        oidc.preferred_username ??
        user.attributes?.name,

      profile:
        oidc.profile ??
        `${config.public.drupalBaseUrl}/user/${uid}`,

      roles:
        oidc.roles ?? ['authenticated'],

      permissions:
        oidc.permissions ?? {},

      avatar,

      birthdate:
        user.attributes?.field_birthdate ?? null,

    };

  } catch (error) {

    if (error instanceof FetchError) {

      throw createError({

        statusCode:
          error.response?.status ?? 500,

        statusMessage:
          'Gagal mengambil data user.',

        message:
          error.response?._data?.message ??
          error.message,

      });

    }

    throw error;

  }

});