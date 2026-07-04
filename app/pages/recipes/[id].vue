<template>
  <div class="py-12 px-4">
    <!-- State Loading -->
    <div v-if="pending" class="flex justify-center items-center h-64">
      <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-primary" />
    </div>

    <!-- Konten Artikel -->
    <article v-else-if="recipe" class="max-w-3xl mx-auto">
      <!-- Header Artikel -->
      <header class="mb-8">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          {{ recipe.title }}
        </h1>
      </header>

      <!-- Gambar Utama -->
      <div v-if="recipe.image" class="mb-10 overflow-hidden rounded-3xl shadow-lg">
        <img 
          :src="recipe.image" 
          :alt="recipe.title" 
          class="w-full h-auto object-cover" 
        />
      </div>

      <!-- Isi Artikel (Body) -->
      <div 
        class="prose prose-lg dark:prose-invert prose-primary max-w-none" 
        v-html="recipe.body"
      ></div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { recipe, pending } = await useRecipeDetail(route.params.id as string);
</script>