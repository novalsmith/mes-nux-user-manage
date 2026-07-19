// app/composables/useApi.ts

import type { NitroFetchOptions } from 'nitropack';
import { useToken } from '~/composables/useToken';

export const useApi = () => {

  const { accessToken } = useToken();

  const api = async <T>(
    url: string,
    options: NitroFetchOptions<string> = {},
  ): Promise<T> => {

    const headers = new Headers(options.headers);

    if (accessToken.value) {
      headers.set(
        'Authorization',
        `Bearer ${accessToken.value}`,
      );
    }

    return await $fetch<T>(url, {
      ...options,
      headers,
    });

  };

  return {
    api,
  };

};