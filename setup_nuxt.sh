#!/bin/bash
set -e

echo "--- 1. Menginstal Nuxt 3 (Latest) ---"
# Menggunakan npx untuk membuat project baru di folder saat ini
npx nuxi@latest init . --yes

echo "--- 2. Menginstal Dependency Utama ---"
npm install

# Instal modul pendukung untuk koneksi ke Drupal
npm install @nuxtjs/axios @pinia/nuxt @pinia-plugin-persistedstate/nuxt

echo "--- 3. Membuat Dockerfile untuk Nuxt ---"
cat <<EOF > Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
EOF

echo "--- 4. Membuat docker-compose.yml untuk Nuxt ---"
cat <<EOF > docker-compose.yml
services:
  nuxt-app:
    build: .
    container_name: nuxt-web
    ports:
      - "3000:3000"
    environment:
      NUXT_PUBLIC_API_BASE: "http://drupal:80/jsonapi"
    restart: always
EOF

echo "--- Setup Nuxt Selesai! ---"
echo "Jalankan 'docker compose up -d' untuk memulai Nuxt."
