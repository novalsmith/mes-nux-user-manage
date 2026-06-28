<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <UContainer>
      <header class="py-6 flex items-center justify-between">
        <h1 class="text-xl font-bold">Drupal Restaurant</h1>
        <UNavigationMenu :items="items" />
        <UColorModeButton />
      </header>
    </UContainer>

    <UContainer class="py-8">
      <slot />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const items = [
  { label: 'Home', icon: 'i-lucide-home', to: '/' },
  { label: 'Articles', icon: 'i-lucide-book-open', to: '/articles' },
  { label: 'Recipes', icon: 'i-lucide-chef-hat', to: '/recipes' }
]
</script>