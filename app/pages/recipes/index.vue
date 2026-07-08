<!-- app/pages/recipes/index.vue -->
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8">Recipes</h1>
    
    <!-- Grid container dengan gap yang cukup untuk ruang napas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <RecipeCard 
        v-for="r in recipes" 
        :key="r.id"
        :image="r.image?.toString() || ''"
        :title="r.title"
        :link="`/recipes/${r.id}`"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
useHead({
    title: 'Recipes',
    meta: [
      { name: 'description', content: 'Browse our collection of recipes.' }
    ]
  });
const { recipes } = await useRecipes(); 
</script>