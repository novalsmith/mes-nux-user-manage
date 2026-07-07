<!-- pages/articles.vue -->
<script setup lang="ts">
import { useArticleService } from '~/services/ArticleService'

const route = useRoute()
const articleService = useArticleService()

// Mengambil parameter 'q' dari URL secara reaktif
const searchKeyword = computed(() => (route.query.q as string) || '')

// useAsyncData akan otomatis running ulang setiap kali nilai 'searchKeyword' berubah
const { data: articles, pending, error } = useAsyncData(
  'articles-list',
  () => {
    if (searchKeyword.value) {
      // Jika ada kata kunci pencarian, panggil API filter title Drupal JSON:API
      return articleService.searchArticlesByTitle(searchKeyword.value)
    }
    // Jika tidak ada keyword, tampilkan semua artikel default
    return articleService.getArticles()
  },
  {
    watch: [searchKeyword] // <-- Mengawasi query parameter URL secara reaktif
  }
)
</script>

<template>
  <div>
    <!-- Header Informasi Pencarian -->
    <div class="mb-6">
      <h1 v-if="searchKeyword" class="text-2xl font-bold">
        Hasil Pencarian untuk: <span class="text-primary-500">"{{ searchKeyword }}"</span>
      </h1>
      <h1 v-else class="text-2xl font-bold">Semua Artikel</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Menampilkan {{ articles?.length || 0 }} artikel ditemukan.
      </p>
    </div>

    <!-- Status Loading -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <p>Memuat artikel...</p>
    </div>

    <!-- Status Error -->
    <div v-else-if="error" class="text-red-500 py-4">
      Gagal memuat data: {{ error.message }}
    </div>

    <!-- Grid Card Artikel -->
    <div v-else-if="articles && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="article in articles" 
        :key="article.id" 
        class="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col justify-between"
      >
        <div>
          <img 
            v-if="article.image" 
            :src="article.image" 
            :alt="article.title" 
            class="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 class="text-lg font-semibold mb-2">{{ article.title }}</h2>
          <div class="text-xs text-gray-400 mb-2">
            Oleh: {{ article.author }} | {{ article.date }}
          </div>
          <!-- Membatasi isi konten -->
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3" v-html="article.content"></p>
        </div>

        <div class="mt-4 flex flex-wrap gap-1">
          <span 
            v-for="tag in article.tags" 
            :key="tag.id" 
            class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
          >
            #{{ tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Jika Data Kosong -->
    <div v-else class="text-center py-12 text-gray-500">
      Tidak ada artikel yang cocok dengan pencarian Anda.
    </div>
  </div>
</template>