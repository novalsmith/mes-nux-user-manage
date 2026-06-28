// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Konfigurasi Runtime agar bisa dibaca di sisi Client dan Server
  runtimeConfig: {
    public: {
      // Mengambil dari .env (atau fallback ke URL Drupal Anda)
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/jsonapi'
    }
  }
})