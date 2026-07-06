// server/api/drupal/[...].ts
export default defineEventHandler(async (event) => {
  // 1. Ambil path mentah setelah domain (misal: /api/drupal/jsonapi/node/article)
  const fullPath = event.path || '';

  // 2. Bersihkan query string dengan jaminan fallback array agar tidak 'undefined'
  const [cleanPath, queryString] = fullPath.split('?') as [string, string?];

  // 3. Ambil sisa path setelah /api/drupal/
  let remainingPath = cleanPath.replace('/api/drupal/', '');

  // 4. Kondisi pintar agar kata 'jsonapi' tidak dobel di target URL
  if (remainingPath.startsWith('jsonapi/')) {
    remainingPath = remainingPath.replace('jsonapi/', '');
  }

  // 5. Gabungkan ke target utama Drupal base URL asli
  const target = `http://localhost:8080/jsonapi/${remainingPath}${queryString ? '?' + queryString : ''}`;

  // Meneruskan request secara murni lewat Nitro stream pipeline
  return proxyRequest(event, target);
});