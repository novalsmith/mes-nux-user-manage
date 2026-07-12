// server/api/auth/register.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  
  try {
    // 1. Minta CSRF token anonim terlebih dahulu dari Drupal
    const csrfToken = await $fetch<string>(`${config.public.drupalBaseUrl}/session/token`);

    // 2. Bungkus payload ke dalam format array entity Drupal
    const drupalPayload = {
      name: [{ value: body.username }],
      mail: [{ value: body.email }],
      pass: [{ value: body.password }]
    };

    // 3. Kirim ke REST endpoint dengan menyertakan token X-CSRF-Token
    const response = await $fetch(`${config.public.drupalBaseUrl}/user/register?_format=json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken // 🌟 Ini yang membuat Drupal mengizinkan akses anonim
      },
      body: drupalPayload
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Gagal melakukan registrasi pada server backend.',
      data: error.data
    });
  }
});