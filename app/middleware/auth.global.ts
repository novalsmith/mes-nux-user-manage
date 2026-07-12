// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Ambil token cookie yang sudah dijamin aman dan didukung penuh oleh SSR Nuxt
  const tokenCookie = useCookie('auth_token');
  const isLoggedIn = !!tokenCookie.value;

  // Daftar halaman publik yang bebas diakses tanpa login
  const publicRoutes = ['/login', '/register']

  // Jika user SUDAH login, mereka tidak boleh mengakses halaman publik (login/register)
  if (publicRoutes.includes(to.path)) {
    if (isLoggedIn) {
      return navigateTo('/');
    }
    return;
  }

  // Jika mencoba masuk ke halaman terproteksi tanpa token, langsung tendang ke /login
  if (!isLoggedIn) {
    return navigateTo('/login');
  }
});