<script setup lang="ts">
const route = useRoute()

// Ikat value input dengan ref
const searchQuery = ref((route.query.q as string) || '')

const handleSearch = () => {
  // Jika kosong, arahkan ke /articles biasa tanpa query
  if (!searchQuery.value.trim()) {
    navigateTo('/articles')
    return
  }

  // Arahkan ke /articles dengan membawa query parameter ?q=
  navigateTo({
    path: '/articles',
    query: {
      q: searchQuery.value.trim()
    }
  })
}

// Sinkronisasi jika query di URL berubah lewat aksi lain (misal tombol back browser)
watch(
  () => route.query.q,
  (newQ) => {
    searchQuery.value = (newQ as string) || ''
  }
)
</script>

<template>
  <UInput
    v-model="searchQuery"
    icon="i-lucide-search"
    size="md"
    variant="outline"
    placeholder="Search articles..."
    @keypress.enter.prevent="handleSearch"
  />
</template>