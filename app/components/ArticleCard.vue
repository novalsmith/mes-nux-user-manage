<template>
  <NuxtLink :to="link" class="inline-block w-full"> 
    <div class="group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      
      <div class="overflow-hidden rounded-2xl">
        <img :src="image" class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      
      <div class="mt-4 flex flex-col gap-2">
        <!-- Tambahan Metadata: Penulis dan Tanggal -->
        <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>By <span class="font-medium text-neutral-700 dark:text-neutral-300">{{ author }}</span></span>
          <span class="text-neutral-300 dark:text-neutral-600">•</span>
          <time>{{ date }}</time>
        </div>

        <h2 class="text-xl font-bold leading-tight text-neutral-800 dark:text-neutral-200 transition-colors duration-300 group-hover:text-primary">
          {{ title }}
        </h2>
      </div>

    </div>
  </NuxtLink>
</template>

<script setup>
// Menambahkan 'author' dan 'date' ke dalam props
defineProps([
  'image',  'title',  'link',  'author',  'date'
])
</script>