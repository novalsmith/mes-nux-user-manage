<template>
  <div style="padding: 40px; text-align: center; font-family: sans-serif;">
    <div v-if="isLoggedIn && user">
      <h1 style="color: #22c55e;">🎉 Koneksi OAuth2 Sukses!</h1>
      <p style="font-size: 1.2rem; margin-top: 20px;">
        Selamat Datang, <strong>{{ user.name }}</strong>!
      </p>
      
      <div style="margin-top: 30px;padding: 20px; display: inline-block; text-align: left; border-radius: 8px;">
        <h3 style="margin-top: 0;">Payload Data dari Drupal (Clean Architecture Model):</h3>
        <pre><code>{{ user }}</code></pre>
      </div>
    </div>
    
    <div v-else-if="loading">
      <h2>Memuat profil pengguna dari Drupal...</h2>
    </div>
    
    <div v-else>
      <h1 style="color: #ef4444;">Akses Ditolak</h1>
      <p>Anda belum melakukan autentikasi lewat Drupal.</p>
      <NuxtLink to="/login">Kembali ke Halaman Login</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const { user, isLoggedIn, loading } = useAuth();
</script>