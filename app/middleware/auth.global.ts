// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Ambil token cookie yang sudah dijamin aman dan didukung penuh oleh SSR Nuxt
  const tokenCookie = useCookie('auth_token');
  const isLoggedIn = !!tokenCookie.value;

  // Halaman login tidak boleh diakses jika user sudah terotentikasi
  if (to.path === '/login') {
    if (isLoggedIn) {
      return navigateTo('/');
    }
    return;
  }

  // Jika mencoba masuk ke dashboard tanpa token, langsung tendang ke /login
  if (!isLoggedIn) {
    return navigateTo('/login');
  }
});