export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, 'authorization');

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing access token'
    });
  }

  try {
    // Menggunakan endpoint standar spesifikasi OIDC production
    const userInfo: any = await $fetch(`${config.public.drupalBaseUrl}/oauth/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    const data = userInfo.data || userInfo; // Jika data berada di dalam properti 'data', gunakan itu

    // Petakan data dari klaim OpenID Connect Drupal Anda
    return {
      // Di standar OIDC, 'sub' (subject) melambangkan User ID unik
      id: data.sub, 
      name: data.name,
      username: data.preferred_username,
      email: data.email,
      email_verified: data.email_verified,
      // Jika di masa depan ada role bawaan OIDC, bisa dimasukkan di sini
      roles: userInfo.roles || ['authenticated'],
      permissions: userInfo.permissions || {},
      profile: data.profile,
      preferred_username: data.preferred_username,
    };

  } catch (error: any) {
    console.error("OIDC UserInfo Fetch Error:", error.response?._data || error.message);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to fetch user profile via OIDC UserInfo',
      message: error.message
    });
  }
});