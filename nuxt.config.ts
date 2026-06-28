// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  // Hapus/comment baris css jika masih bermasalah:
  css: ['~/assets/css/main.css'], 
  devServer: {
    port: 3002
  }
})