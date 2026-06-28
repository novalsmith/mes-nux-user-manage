<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Header Container untuk membatasi lebar -->
    <UContainer>
      <header class="py-6 flex items-center justify-between">
        <h1 class="text-xl font-bold">Umami Food</h1>
        
        <!-- Navigasi dengan style yang lebih rapi -->
        <UNavigationMenu :items="items" />
        
        <!-- Tambahkan ColorModeButton di sini jika perlu -->
        <UColorModeButton />
      </header>
    </UContainer>

    <!-- Main Content Container -->
    <UContainer class="py-8">
      <slot />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Di v3, items tidak selalu perlu tipe data eksplisit jika sudah didefinisikan dengan benar
const items = [
  { label: 'Home', icon: 'i-lucide-home', to: '/' },
  { label: 'Articles', icon: 'i-lucide-book-open', to: '/articles' },
  { label: 'Recipes', icon: 'i-lucide-chef-hat', to: '/recipes' }
]
</script>