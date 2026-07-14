export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // 1. Ambil token dari header Authorization
  const authHeader = getHeader(event, 'authorization');

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing access token'
    });
  }

  try {
    // 2. Ambil data dasar dari endpoint OIDC standar Drupal
    const userInfo: any = await $fetch(`${config.public.drupalBaseUrl}/oauth/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    
    // Menggunakan data.sub (berisi angka UID seperti 11)
    const userId = userInfo.sub || userInfo.id;

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: OIDC User ID (sub) not found'
      });
    }

    // 3. Tembak JSON:API menggunakan filter drupal_internal__uid agar cocok dengan data.sub
    // Dan sertakan parameter include=user_picture untuk menarik data foto profil
    const jsonApiResponse: any = await $fetch(
      `${config.public.drupalBaseUrl}/en/jsonapi/user/user?filter[drupal_internal__uid]=${userId}&include=user_picture`, 
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/vnd.api+json'
        }
      }
    );

    // 4. Karena menggunakan filter, data user berada di dalam array indeks ke-0
    const userData = jsonApiResponse.data?.[0];
    if (!userData) {
      throw createError({
        statusCode: 404,
        statusMessage: `User with UID ${userId} not found in Drupal JSON:API`
      });
    }

    // 5. Ekstrak URL foto profil dari bagian 'included'
    let avatarUrl = null;
    if (jsonApiResponse.included && Array.isArray(jsonApiResponse.included)) {
      const fileEntity = jsonApiResponse.included.find((item: any) => item.type === 'file--file');
      if (fileEntity && fileEntity.attributes?.uri?.url) {
        // Gabungkan base URL Drupal dengan path relatif file gambar
        avatarUrl = `${config.public.drupalBaseUrl}${fileEntity.attributes.uri.url}`;
      }
    }

    const userAttributes = userData.attributes || {};

    // 6. Kembalikan payload bersih dan lengkap ke frontend Nuxt
    return {
      id: userId, // Tetap menggunakan UID angka Anda
      name: userInfo.name || userAttributes.display_name,
      username: userInfo.preferred_username || userAttributes.name,
      email: userInfo.email || userAttributes.mail,
      email_verified: userInfo.email_verified || false,
      roles: userInfo.roles || ['authenticated'],
      permissions: userInfo.permissions || {},
      profile: userInfo.profile || `${config.public.drupalBaseUrl}/user/${userId}`,
      preferred_username: userInfo.preferred_username || userAttributes.name,
      // SEKARANG FOTO AMAN DAN SUDAH TEMBUS KE FRONTEND
      avatar: avatarUrl, 
      // Siap digunakan untuk menampung data ulang tahun nanti
      birthdate: userAttributes.field_birthdate || null 
    };

  } catch (error: any) {
    console.error("Error fetching full user profile via filter:", error.response?._data || error.message);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to fetch complete user profile from Drupal',
      message: error.message
    });
  }
});