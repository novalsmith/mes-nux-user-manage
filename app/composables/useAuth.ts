// composables/useAuth.ts
import { AuthDatasource } from '../implementation/Auth';
import { AuthRepositoryImpl } from '../services/AuthService';
import { useAuthState } from './useAuthState'; // Pastikan path import ini sesuai dengan lokasi file Anda

export const useAuth = () => {
  const config = useRuntimeConfig();
  const datasource = new AuthDatasource();
  const repository = new AuthRepositoryImpl(datasource, config);
  
  // 1. Ambil state global dari useAuthState
  const { user, setUser, clearAuth } = useAuthState();
  
  const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 });
  const loading = ref(false);
  const errorMessage = ref('');

  const executeLogin = async (username: string, password: string) => {
    loading.value = true;
    errorMessage.value = '';
    try {
      // 1. Ambil Token OAuth
      const tokens = await repository.login(username, password);
      tokenCookie.value = tokens.accessToken;

      // 2. Ambil data User Info dari Drupal
      const rawUser = await repository.getCurrentUser(tokens.accessToken);
      
      const cleanUserData = {
        id: rawUser.id,
        roles: rawUser.roles,
        permissions: rawUser.permissions,
        email: rawUser.email,
        profile: rawUser.profile,
        preferred_username: rawUser.preferred_username,
        name: rawUser.name
      };

      // 3. Simpan data user ke dalam useState (Aman dari async gap & SSR)
      setUser(cleanUserData);

      return cleanUserData;
    } catch (error: any) {
      console.error('Login failed:', error);
      errorMessage.value = error.statusMessage || 'Username atau password salah.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 4. Tambahkan fungsi logout agar pengelolaan auth terpusat
  const logout = () => {
    tokenCookie.value = null;
    clearAuth();
    navigateTo('/login');
  };

  return {
    // Kembalikan data user reaktif dan status login langsung ke pemanggil
    user: computed(() => user.value),
    isLoggedIn: computed(() => !!tokenCookie.value),
    loading,
    errorMessage,
    executeLogin,
    logout
  };
};