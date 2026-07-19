// middleware/auth.global.ts

import { useToken } from '~/composables/useToken';

export default defineNuxtRouteMiddleware((to) => {

  const { accessToken } = useToken();

  const publicRoutes = [
    '/login',
    '/register',
  ];

  const isLoggedIn = !!accessToken.value;

  if (publicRoutes.includes(to.path)) {

    if (isLoggedIn) {
      return navigateTo('/');
    }

    return;

  }

  if (!isLoggedIn) {
    return navigateTo('/login');
  }

});