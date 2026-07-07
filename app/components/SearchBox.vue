<script setup lang="ts">
import { useArticleSearchBox } from '~/composables/useArticleSearchBox';
const { searchQuery, handleSearch } = useArticleSearchBox()
</script>

<template>
  <UInput
    v-model="searchQuery"
    icon="i-lucide-search"
    size="md"
    variant="outline"
    placeholder="Search articles... (min. 3 characters)"
    @keypress.enter.prevent="handleSearch"
  />
</template>