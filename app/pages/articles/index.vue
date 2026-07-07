<!-- app/pages/articles/index.vue -->
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8">Articles</h1>
    
    <!-- Grid container dengan gap yang cukup untuk ruang napas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  </div>
</template>

<script setup lang="ts">
// Pastikan data artikel tersedia
const { articles } = await useArticle(); 
</script>