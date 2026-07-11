import { createHash } from 'crypto';

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  // String verifier mentah yang aman
  const verifier = 'db-jft-je-z4-cvp-m-b92-k27uhb-uju1p1r-w-w1g-wfo-ej-xk';
  
  // Hitung SHA256 Base64URL secara presisi sesuai standard RFC 7636
  const challenge = createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Hapus padding '='

  const options = {
    response_type: 'code',
    client_id: config.public.oauthClientId,
    redirect_uri: `${config.public.baseUrl}/api/auth/callback`,
    scope: 'authenticated',
    code_challenge: challenge, // Hasil kalkulasi dinamis Node.js
    code_challenge_method: 'S256'
  };
  
  const qs = new URLSearchParams(options).toString();
  const authorizationUrl = `${config.public.drupalBaseUrl}/oauth/authorize?${qs}`;

  return { url: authorizationUrl };
});