// composables/useAuthState.ts
export const useAuthState = () => {
  // State reaktif yang dibagikan secara global di seluruh aplikasi
  const user = useState<any>('auth_user', () => {
    // Ambil dari localStorage hanya di sisi client saat inisialisasi awal
    if (import.meta.client) {
      return JSON.parse(localStorage.getItem('user') || 'null');
    }
    return null;
  });

  const setUser = (userData: any) => {
    user.value = userData;
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const clearAuth = () => {
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('user');
    }
  };

  return {
    user,
    setUser,
    clearAuth
  };
};