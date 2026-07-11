// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Ambil cookie auth_token yang sudah diset di composable useAuth
  const tokenCookie = useCookie('auth_token');

  // Daftar halaman yang boleh diakses TANPA login
  const publicPages = ['/login'];

  // Jika token TIDAK ADA dan user mencoba mengakses halaman terproteksi (seperti /)
  if (!tokenCookie.value && !publicPages.includes(to.path)) {
    // Paksa redirect ke halaman login
    return navigateTo('/login');
  }

  // Jika token ADA dan user yang sudah login mencoba iseng membuka halaman /login lagi
  if (tokenCookie.value && to.path === '/login') {
    // Kembalikan ke dashboard utama
    return navigateTo('/');
  }
});