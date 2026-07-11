// stores/auth.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Pengecekan ketat agar server engine tidak mencari localStorage
    user: (import.meta.client && localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null,
  }),
  
  actions: {
    setUser(userData: any) {
      this.user = userData;
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    },
    clearAuth() {
      this.user = null;
      if (import.meta.client) {
        localStorage.removeItem('user');
      }
    }
  }
});