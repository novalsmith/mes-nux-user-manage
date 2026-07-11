import tailwindcss from "@tailwindcss/vite";

// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3002
  },
  vite: {
    plugins: [
      tailwindcss(),// Vite plugin configuration
    ],
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  },
  runtimeConfig: {
    oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
    public: {
      drupalBaseUrl: process.env.DRUPAL_BASE_URL || 'http://localhost:8080',
      baseUrl: process.env.BASE_URL || 'http://localhost:3002',
      oauthClientId: process.env.OAUTH_CLIENT_ID
    }
  }
})