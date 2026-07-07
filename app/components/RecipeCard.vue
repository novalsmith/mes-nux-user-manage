<template>
  <NuxtLink :to="link" class="inline-block w-full"> 
    <div class="group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      
      <div class="overflow-hidden rounded-2xl">
        <img :src="image" class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      
      <div class="mt-4 flex flex-col gap-2">
        <h2 class="text-xl font-bold leading-tight text-neutral-800 dark:text-neutral-200 transition-colors duration-300 group-hover:text-primary">
          {{ title }}
        </h2>
      </div>

    </div>
  </NuxtLink>
</template>

<script setup>
defineProps(['image', 'title', 'link'])
</script>