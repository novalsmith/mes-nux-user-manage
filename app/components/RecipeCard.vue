<template>
  <NuxtLink :to="link" class="block h-full"> 
    <div class="group flex flex-col h-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#0b0d19]/60 backdrop-blur transition-all duration-300 hover:border-neutral-700 hover:bg-[#0f1222]">
      
      <div class="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 border-b border-neutral-800">
        <img 
          :src="image" 
          :alt="title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
        />
      </div>
      
      <div class="flex flex-1 flex-col p-6">
        
        <div class="flex items-center gap-3 text-sm">
          <span 
            class="rounded-md px-2 py-0.5 text-xs font-medium border"
            :class="type === 'Release' 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' 
              : 'bg-teal-950/40 text-teal-400 border-teal-800/60'"
          >
            {{ type || 'Article' }}
          </span>
          <time class="text-neutral-400 text-xs font-medium">{{ date }}</time>
        </div>

        <h2 class="mt-4 text-xl font-bold tracking-tight text-neutral-100 transition-colors duration-300 group-hover:text-emerald-400">
          {{ title }}
        </h2>

        <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400 flex-1">
          {{ description }}
        </p>

        <div class="mt-6 flex items-center gap-3 border-t border-neutral-800/60 pt-4">
          <img 
            :src="authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'" 
            :alt="author"
            class="h-7 w-7 rounded-full object-cover ring-1 ring-neutral-700"
          />
          <span class="text-xs font-medium text-neutral-300">{{ author }}</span>
        </div>

      </div>

    </div>
  </NuxtLink>
</template>

<script setup>
// Menambahkan prop 'type', 'description', dan 'authorAvatar'
defineProps({
  image: String,
  title: String,
  link: String,
  author: String,
  authorAvatar: String, // Untuk foto profile penulis di pojok kiri bawah
  date: String,
  type: String,        // Mengisi 'Article' atau 'Release'
  description: String   // Teks rangkuman di bawah judul
})
</script>