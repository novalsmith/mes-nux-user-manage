<!-- pages/index.vue -->
<template>
  <div class="dashboard-content">
    <!-- Konten di bawah ini dijamin aman karena hanya bisa diakses setelah login sukses -->
    <h1 class="text-3xl font-bold text-green-500 mb-4">🎉 Koneksi OAuth2 Sukses!</h1>
    <p class="text-lg">
      Selamat Datang di Dashboard, <strong>{{ user?.name }} </strong>!
    </p>
    
    <div class="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
      <h3 class="font-semibold mb-2">Payload Data Terotentikasi:</h3>
      <pre class="text-xs overflow-x-auto"><code>{{ user }}</code></pre>
    </div>

    <UButton @click="logout" color="neutral" variant="ghost" class="mt-4">
      Log Out
    </UButton>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'default'
});

const { user, logout } = useAuth();
// Logika onMounted penendang sudah dihapus karena sudah ditangani Middleware secara global
</script>