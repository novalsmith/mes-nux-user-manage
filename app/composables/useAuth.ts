import { AuthDatasource } from '../implementation/Auth';
import { AuthRepositoryImpl } from '../services/AuthService';

export const useAuth = () => {
  const config = useRuntimeConfig();
  const datasource = new AuthDatasource();
  const repository = new AuthRepositoryImpl(datasource, config);

  const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 });
  const userState = useState<any>('auth_user', () => null);
  const loading = ref(false);

  // UBAH: Jadikan async untuk menangani fetch URL dari server route
  const redirectToLogin = async () => {
    loading.value = true;
    try {
      const targetUrl = await repository.getAuthorizationUrl();
      window.location.href = targetUrl;
    } catch (error) {
      console.error('Redirect failed:', error);
    } finally {
      loading.value = false;
    }
  };

  // Di dalam file useAuth.ts
const handleCallback = async (code: string) => {
  loading.value = true;
  try {
    const tokens = await repository.exchangeCodeForToken(code, 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');
    
    tokenCookie.value = tokens.accessToken;

    // Ambil data user dari endpoint /api/auth/me
    const rawUser = await repository.getCurrentUser(tokens.accessToken);
    
    // Ambil ID secara aman: cek apakah ada .data (jika pakai model lama) atau langsung ambil .id
    userState.value = {
      id: rawUser.id,
      roles: rawUser.roles,
      permissions: rawUser.permissions,
      email: rawUser.email,
      profile: rawUser.profile,
      preferred_username: rawUser.preferred_username,
      name: rawUser.name
    };
    
    // Redirect ke halaman utama
    navigateTo('/');
  } catch (error) {
    console.error('Authentication failed:', error);
  } finally {
    loading.value = false;
  }
};

  return {
    user: computed(() => userState.value),
    isLoggedIn: computed(() => !!tokenCookie.value),
    loading,
    redirectToLogin,
    handleCallback
  };
};