<template>
  <div class="login-box">
    <h2>Selamat Datang</h2>
    <p>Silakan masuk menggunakan akun Drupal terintegrasi Anda.</p>
     <UButton @click="redirectToLogin" color="primary" variant="solid">Lihat Artikel</UButton>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';
const { redirectToLogin } = useAuth();
</script>