<!-- pages/index.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold">Selamat Datang di Drupal Restaurant</h1>
    <UButton color="primary" variant="solid">Lihat Artikel</UButton>
    
  </div>
</template>

<script setup lang="ts">
  useHead({
    title: 'Home',
    meta: [
      { name: 'description', content: 'Welcome to our restaurant!' }
    ]
  });
</script>
