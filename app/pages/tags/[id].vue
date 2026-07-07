<template>
  <div class="py-12 px-4">
    <div v-if="pending">Loading artikel...</div>
    
    <div v-else-if="error">Terjadi kesalahan saat memuat data.</div>
    
    <div v-else>
      <h1 class="text-3xl font-bold mb-8">Artikel Terkait</h1>
      
      <div v-if="articles && articles.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <div v-else>
        <p>Tidak ada artikel yang menggunakan tag ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const tagId = route.params.id as string;

// Ambil properti 'articles' sesuai dengan return terbaru dari composable
const { articles, pending, error } = await getArticlesByTag(tagId); 
</script>