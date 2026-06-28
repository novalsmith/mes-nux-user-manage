<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
{
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
  },  
{
    label: 'Articles',
    icon: 'i-lucide-book-open',
    to: '/articles',
  }, 
  {
    label: 'Recipes',
    icon: 'i-simple-icons-github',
    badge: '3.8k',
    to: '/recipes'
  }
])
</script>

<template>
    <div>
      <UNavigationMenu :items="items" class="w-full justify-center" />
    <slot />
  </div>
  
</template>
