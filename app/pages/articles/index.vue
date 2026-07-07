<!-- app/pages/articles/index.vue -->
<template>
  <div class="p-6">
    <!-- Header dinamis untuk menandakan jika sedang dalam mode pencarian -->
    <h1 class="text-3xl font-bold mb-8">
      {{ searchKeyword ? `Search Results for "${searchKeyword}"` : 'Articles' }}
    </h1>
    
    <!-- Status Loading -->
    <div v-if="pending" class="flex justify-center items-center py-12 text-gray-500">
      <p>Loading articles...</p>
    </div>

    <!-- Tampilkan data jika berhasil di-load -->
    <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ArticleCard 
        v-for="a in articles" 
        :key="a.id"
        :image="a.image"
        :title="a.title"
        :link="`/articles/${a.id}`"
        :tags="a.tags"
        :author="a.author"
        :date="a.date"
      />
    </div>

    <!-- Tampilkan pesan jika hasil pencarian kosong -->
    <div v-else class="text-center py-12 text-gray-500">
      No articles found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticleService } from '~/services/ArticleService'

const route = useRoute()
const articleService = useArticleService()

// 1. Ambil query string '?q=' dari URL secara reaktif
const searchKeyword = computed(() => (route.query.q as string) || '')

// 2. Gunakan useAsyncData dengan mendengarkan perubahan searchKeyword
const { data: articles, pending } = await useAsyncData(
  'articles-display-list',
  () => {
    if (searchKeyword.value) {
      // Jika ada kata kunci di URL, panggil pencarian ke Drupal
      return articleService.searchArticlesByTitle(searchKeyword.value)
    }
    // Jika tidak ada query, tampilkan semua artikel seperti biasa
    return articleService.getArticles()
  },
  {
    // CRITICAL: Memaksa Nuxt melakukan hit API ulang ke Drupal 
    // setiap kali Anda mengetik teks baru dan menekan Enter di SearchBox
    watch: [searchKeyword]
  }
)
</script>