<template>
  <div class="py-12 px-4">
    <!-- State Loading -->
    <div v-if="pending" class="flex justify-center items-center h-64">
      <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-primary" />
    </div>

       

    <!-- Konten Artikel -->
    <article v-else-if="article" class="max-w-3xl mx-auto">
      <!-- Header Artikel -->
      <header class="mb-8">
     

        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          {{ article.title }}
        </h1>
             <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>By <span class="font-medium text-neutral-700 dark:text-neutral-300">{{ article.author }}</span></span>
          <span class="text-neutral-300 dark:text-neutral-600">•</span>
          <time>{{ article.date }}</time>
        </div>
      </header>

        <div class="mb-6">
          
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Tags:</h2>
        <div class="flex flex-wrap gap-2">
        <NuxtLink 
          v-for="tag in article.tags" 
          :key="tag.id" 
          :to="`/tags/${tag.id}`"
          class="inline-block"
        >
          <UBadge variant="subtle">
            {{ tag.name }}
          </UBadge>
        </NuxtLink>
        </div>
      </div>   

      <!-- Gambar Utama -->
      <div v-if="article.image" class="mb-10 overflow-hidden rounded-3xl shadow-lg">
        <img 
          :src="article.image" 
          :alt="article.title" 
          class="w-full h-auto object-cover" 
        />
      </div>

      <!-- Isi Artikel (Body) -->
      <div 
        class="prose prose-lg dark:prose-invert prose-primary max-w-none" 
        v-html="article.content"
      ></div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { article, pending } = await useArticleDetail(route.params.id as string);
</script>