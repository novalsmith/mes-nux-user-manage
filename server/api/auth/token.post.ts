export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const formData = new URLSearchParams();
  formData.append('grant_type', 'authorization_code');
  formData.append('client_id', config.public.oauthClientId);
  formData.append('code', body.code);
  formData.append('redirect_uri', config.public.baseUrl + '/api/auth/callback');
  formData.append('scope', 'authenticated');
  
  // Gunakan string mentah yang sama persis dengan file authorize tadi
  formData.append('code_verifier', 'db-jft-je-z4-cvp-m-b92-k27uhb-uju1p1r-w-w1g-wfo-ej-xk');

  try {
    return await $fetch(`${config.public.drupalBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
  } catch (error: any) {
    const errorData = error.response?._data || error.data;
    console.error("Drupal OAuth Error Detail:", errorData);

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: "Drupal Token Exchange Failed",
      message: typeof errorData === 'object' ? JSON.stringify(errorData) : errorData
    });
  }
});