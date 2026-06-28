// server/api/drupal/[...].ts
export default defineEventHandler(async (event) => {
  // Ambil path asli dari request browser
  const path = event.path.replace('/api/drupal/', '');
  
  // Ambil query string mentah agar tidak di-encode ulang oleh Nitro
  const queryString = event.path.split('?')[1] || '';
  
  const target = `http://localhost:8080/jsonapi/${path.split('?')[0]}${queryString ? '?' + queryString : ''}`;

  return proxyRequest(event, target);
});