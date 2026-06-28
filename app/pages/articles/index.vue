<template>
  <div>
    <h1>Articles</h1>
    <ul>
      <li v-for="a in articles" :key="a.id">
        <NuxtLink :to="`/articles/${a.id}`">
          <img v-if="a.image" :src="a.image" width="100" />
          <h2>{{ a.title }}</h2>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Pastikan fungsi useArticle mengembalikan data yang sudah dimap
const { articles } = await useArticle(); 
</script>