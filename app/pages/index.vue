<!-- pages/index.vue -->
<script setup>
import { useAuth } from '~/composables/useAuth';

const { user } = useAuth();
</script>

<template>
  <div class="space-y-4">
    <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <h1 v-if="user" class="text-2xl font-bold text-gray-900 dark:text-white">
        Selamat Datang Kembali, {{ user.name }}! 👋
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Gunakan tombol menu di bagian atas untuk mengakses seluruh fitur dashboard sistem Anda.
      </p>
    </div>
  </div>
</template>