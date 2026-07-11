<template>
  <div class="callback-container" style="text-align: center; margin-top: 50px;">
    <div v-if="loading">
      <h2>Memproses Autentikasi...</h2>
      <p>Mohon tunggu, sedang menukarkan kode keamanan dengan token.</p>
    </div>
    <div v-else>
      <h2>Mengalihkan halaman...</h2>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const route = useRoute();
const { handleCallback, loading } = useAuth();
const isProcessing = ref(false); // Flag pengaman

onMounted(() => {
  const code = route.query.code;
  
  if (code) {
    if (isProcessing.value) return; // Jika sedang berjalan, abaikan pemicu kedua
    isProcessing.value = true;

    // Jalankan fungsi untuk menukar token
    handleCallback(code);
  } else {
    console.error('Authorization code tidak ditemukan di URL');
    navigateTo('/login');
  }
});
</script>