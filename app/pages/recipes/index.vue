<template>
  <div>
    <h1>Recipes</h1>
    <ul>
      <li v-for="r in recipes" :key="r.id">
        <NuxtLink :to="`/recipes/${r.id}`">
          <img v-if="r.image" :src="r.image" width="100" />
          <h2>{{ r.title }}</h2>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Pastikan fungsi useArticle mengembalikan data yang sudah dimap
const { recipes } = await useRecipes(); 
</script>