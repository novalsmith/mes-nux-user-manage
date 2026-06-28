<template>
  <div v-if="article">
    <NuxtLink to="/articles">Kembali ke Daftar</NuxtLink>
    <h1>{{ article.title }}</h1>
    <img v-if="article.image" :src="article.image" style="max-width: 500px" />
    <div v-html="article.body"></div>
  </div>
  <div v-else>
    <p>Memuat artikel...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

// Fetch data detail berdasarkan id
const { data: article } = await useFetch(
  `${config.public.apiBase}/node/article/${route.params.id}?include=field_media_image,field_media_image.field_media_image`,
  {
    transform: (raw: any) => {
      const item = raw.data;
      const mediaId = item.relationships?.field_media_image?.data?.id;
      const mediaItem = raw.included?.find((inc: any) => inc.id === mediaId);
      const fileId = mediaItem?.relationships?.field_media_image?.data?.id;
      const fileItem = raw.included?.find((inc: any) => inc.id === fileId);
      
      return {
        title: item.attributes.title,
        body: item.attributes.field_body?.processed,
        image: fileItem ? `${config.public.apiBase.replace('/jsonapi', '')}${fileItem.attributes.uri.url}` : null
      };
    }
  }
);
</script>