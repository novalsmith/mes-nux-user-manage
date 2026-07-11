// composables/useAuth.ts
import { AuthDatasource } from '../implementation/Auth';
import { AuthRepositoryImpl } from '../services/AuthService';

export const useAuth = () => {
  const config = useRuntimeConfig();
  const datasource = new AuthDatasource();
  const repository = new AuthRepositoryImpl(datasource, config);

  const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 });
  const userState = useState<any>('auth_user', () => null);
  const loading = ref(false);
  const errorMessage = ref('');

  const executeLogin = async (username: string, password: string) => {
    loading.value = true;
    errorMessage.value = '';
    try {
      // 1. Ambil Token langsung via Nuxt Server API
      const tokens = await repository.login(username, password);
      tokenCookie.value = tokens.accessToken;

      // 2. Ambil data User Info
      const rawUser = await repository.getCurrentUser(tokens.accessToken);
      userState.value = {
        id: rawUser.id,
        roles: rawUser.roles,
        permissions: rawUser.permissions,
        email: rawUser.email,
        profile: rawUser.profile,
        preferred_username: rawUser.preferred_username,
        name: rawUser.name
      };

      // 3. SELESAI: Redirect ke Dashboard Utama jika sukses
      navigateTo('/');
    } catch (error: any) {
      // GAGAL: Tetap di halaman login, tampilkan pesan error
      console.error('Login failed:', error);
      errorMessage.value = error.statusMessage || 'Username atau password salah.';
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    tokenCookie.value = null;
    userState.value = null;
    navigateTo('/login');
  };

  return {
    user: computed(() => userState.value),
    isLoggedIn: computed(() => !!tokenCookie.value),
    loading,
    errorMessage,
    executeLogin,
    logout
  };
};