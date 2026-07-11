// server/api/auth/token.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Username dan password wajib diisi.",
    });
  }

  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('client_id', config.public.oauthClientId);
  formData.append('username', body.username);
  formData.append('password', body.password);
  
  // OPSI A: Hapus scope terlebih dahulu agar Drupal mencocokkan otomatis berdasarkan role user
  // formData.append('scope', 'authenticated'); 

  // OPSI B: Jika di halaman edit Consumer Drupal Anda mengisi "New Secret", 
  // masukkan variabel config secret Anda di sini:
  formData.append('client_secret', config.oauthClientSecret); 

  try {
    const response = await $fetch(`${config.public.drupalBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    
    return response;
  } catch (error: any) {
    // Menangkap pesan error asli dari Drupal untuk debugging
    const errorData = error.response?._data || error.data || {};
    console.error("Detail Error Asli dari Drupal:", errorData);

    // Ambil pesan error spesifik jika ada (misal: 'Invalid credentials')
    const drupalHint = errorData.message || errorData.error_description || "Username atau password salah.";

    throw createError({
      statusCode: error.response?.status || 401,
      statusMessage: "Login Gagal",
      message: drupalHint // Menampilkan pesan asli agar tahu salahnya di mana
    });
  }
});