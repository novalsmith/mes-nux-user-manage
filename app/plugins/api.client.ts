// app/plugins/api.client.ts

export default defineNuxtPlugin(() => {

  const accessToken = useCookie<string | null>('auth_token');

  const refreshToken = useCookie<string | null>('refresh_token');

  const api = $fetch.create({

    async onRequest({ options }) {

      if (!options.headers) {
        options.headers = {};
      }

      if (accessToken.value) {

        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`,
        };

      }

    },

    async onResponseError(ctx) {

      const { response, request, options } = ctx;

      /**
       * Bukan Unauthorized
       */
      if (response.status !== 401) {
        throw response;
      }

      /**
       * Tidak punya Refresh Token
       */
      if (!refreshToken.value) {

        accessToken.value = null;

        navigateTo('/login');

        return;

      }

      try {

        /**
         * Refresh Access Token
         */
        const tokens = await $fetch<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        }>(
          '/api/auth/refresh',
          {
            method: 'POST',
            body: {
              refreshToken: refreshToken.value,
            },
          },
        );

        /**
         * Simpan token baru
         */
        accessToken.value =
          tokens.accessToken;

        refreshToken.value =
          tokens.refreshToken;

        /**
         * Ulang request sebelumnya
         */
        return await $fetch(request, {

          ...options,

          headers: {

            ...(options.headers ?? {}),

            Authorization:
              `Bearer ${tokens.accessToken}`,

          },

        });

      } catch {

        accessToken.value = null;

        refreshToken.value = null;

        navigateTo('/login');

      }

    },

  });

  return {

    provide: {

      api,

    },

  };

});