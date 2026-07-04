<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

// Navigasi Utama
const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Home', to: '/', active: route.path === '/', icon: 'i-lucide-home' },
  { label: 'Articles', to: '/articles', active: route.path === '/articles', icon: 'i-lucide-book-open' },
  { label: 'Recipes', to: '/recipes', active: route.path === '/recipes', icon: 'i-lucide-chef-hat' },
  { label: 'Releases', to: 'https://github.com/nuxt/ui/releases', target: '_blank', icon: 'i-lucide-git-branch' }
])

// Sub-Menu untuk baris kedua
const subItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Get Started', to: '/docs' },
  { label: 'Components', to: '/components' },
  { label: 'Composables', to: '/composables' },
  { label: 'Typography', to: '/typography' }
])
</script>

<template>
  <UHeader>
    <template #title>
      <Logo class="h-6 w-auto" />
    
    </template>

    <UNavigationMenu :items="items" />
    

    <template #right>
<SearchBox />
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>

  <!-- <div class="border-b border-gray-200 dark:border-gray-800">
      <UContainer>
        <UNavigationMenu :items="subItems" class="py-2" />
      </UContainer>
    </div> -->


       <UMain>
      <UContainer class="py-8">
        <slot />
      </UContainer>
    </UMain>
</template>

 
  
