<!-- <template>
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
</script> -->

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/',
    icon: 'i-lucide-home'
  },
  {
    label: 'Articles',
    to: '/articles',
    active: route.path === '/articles',
    icon: 'i-lucide-book-open'
  },
  {
    label: 'Recipes',
    to: '/recipes',
    active: route.path === '/recipes',
    icon: 'i-lucide-chef-hat'
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank',
    icon: 'i-lucide-git-branch'
  }
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
     <UContainer class="py-8">
      <slot />
    </UContainer>
</template>
