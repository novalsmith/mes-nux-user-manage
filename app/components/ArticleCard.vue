<template>
  <!-- SKELETON LOADING STATE -->
  <div 
    v-if="loading" 
    class="flex flex-col h-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/60 dark:border-neutral-800 dark:bg-[#0b0d19]/60 backdrop-blur animate-pulse"
  >
    <div class="relative aspect-[16/9] w-full bg-neutral-200 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800"></div>
    <div class="flex flex-1 flex-col p-6">
      <div class="flex items-center gap-3">
        <div class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-16"></div>
        <div class="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div>
      </div>
      <div class="mt-4 space-y-2">
        <div class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
        <div class="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
      </div>
      <div class="mt-4 space-y-2 flex-1">
        <div class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
        <div class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
        <div class="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5"></div>
      </div>
      <div class="mt-6 flex items-center gap-3 border-t border-neutral-200 dark:border-neutral-800/60 pt-4">
        <div class="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
        <div class="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div>
      </div>
    </div>
  </div>

  <!-- ACTUAL DATA STATE -->
  <NuxtLink v-else :to="link" class="block h-full"> 
    <div class="group flex flex-col h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#0b0d19]/60 backdrop-blur transition-all duration-300 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-[#0f1222] shadow-sm dark:shadow-none">
      
      <div class="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div 
          v-if="imageLoading" 
          class="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse"
        ></div>
        
        <img 
          :src="image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'" 
          :alt="title"
          @load="imageLoading = false"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          :class="{ 'opacity-0': imageLoading, 'opacity-100 transition-opacity duration-300': !imageLoading }"
        />
      </div>
      
      <div class="flex flex-1 flex-col p-6">
        <div class="flex items-center gap-3 text-sm">
          <span 
            class="rounded-md px-2 py-0.5 text-xs font-medium border"
            :class="hasCategory 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60' 
              : 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/60'"
          >
            {{ hasCategory ? category[0].name : 'Article' }}
          </span>
          <time class="text-neutral-500 dark:text-neutral-400 text-xs font-medium">{{ date }}</time>
        </div>

        <h2 class="mt-4 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {{ title }}
        </h2>

        <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 flex-1">
          {{ description || 'No description available.' }}
        </p>

        <div class="mt-6 flex items-center gap-3 border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
          <div class="relative h-7 w-7 flex items-center justify-center">
            <!-- Loading State untuk Avatar -->
            <div 
              v-if="authorAvatar && avatarLoading" 
              class="absolute inset-0 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse"
            ></div>
            
            <!-- Kondisi 1: Jika user punya Avatar asli dari Drupal -->
            <img 
              v-if="authorAvatar"
              :src="authorAvatar" 
              :alt="author"
              @load="avatarLoading = false"
              class="h-7 w-7 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
              :class="{ 'opacity-0': avatarLoading, 'opacity-100 transition-opacity duration-300': !avatarLoading }"
            />

            <!-- Kondisi 2: Jika user tidak memasang foto (Fallback menggunakan Inisial Nama) -->
            <div 
              v-else 
              class="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 ring-1 ring-emerald-200 dark:ring-emerald-800/50 flex items-center justify-center"
            >
              <span class="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                {{ authorInitial }}
              </span>
            </div>
          </div>
          <span class="text-xs font-medium text-neutral-700 dark:text-neutral-300">{{ author }}</span>
        </div>

      </div>

    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  loading: Boolean,     
  image: String,
  title: String,
  link: {
    type: String,
    default: '#'
  },
  author: {
    type: String,
    default: 'Admin'
  },
  authorAvatar: String, 
  date: String,
  category: {
    type: Array,
    default: () => []
  },  
  description: String   
})

const imageLoading = ref(true)
const avatarLoading = ref(true)

const hasCategory = computed(() => {
  return props.category && props.category.length > 0 && props.category[0]?.name
})

// Mengambil huruf pertama nama author sebagai inisial jika tidak ada gambar profil
const authorInitial = computed(() => {
  return props.author ? props.author.charAt(0) : 'A'
})
</script>