// app/composables/useAuthState.ts

import type { User } from '~/model/AuthModel';

export const useAuthState = () => {
  /**
   * Shared state authentication
   */
  const user = useState<User | null>(
    'auth_user',
    () => {
      if (import.meta.client) {
        const stored = localStorage.getItem('user');

        return stored
          ? JSON.parse(stored) as User
          : null;
      }

      return null;
    },
  );

  /**
   * Simpan user
   */
  const setUser = (
    userData: User,
  ) => {

    user.value = userData;

    if (import.meta.client) {
      localStorage.setItem(
        'user',
        JSON.stringify(userData),
      );
    }

  };

  /**
   * Hapus session login
   */
  const clearAuth = () => {

    user.value = null;

    if (import.meta.client) {
      localStorage.removeItem('user');
    }

  };

  return {
    user,
    setUser,
    clearAuth,
  };
};