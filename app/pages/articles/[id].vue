<template>
  <div v-if="pending">Memuat artikel...</div>
  <div v-else-if="article">
    <NuxtLink to="/articles">Kembali ke Daftar</NuxtLink>
    <h1>{{ article.title }}</h1>
    <img v-if="article.image" :src="article.image" style="max-width: 500px" />
    <div v-html="article.body"></div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { article, pending } = await useArticleDetail(route.params.id as string);
</script>