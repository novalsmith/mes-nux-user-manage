<template>
  <div class="min-h-screen text-neutral-200">
    <div v-if="pending" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
      <div class="flex items-center gap-2 mb-6">
        <div class="h-4 bg-neutral-800 rounded w-16"></div>
        <div class="h-4 bg-neutral-800 rounded w-4"></div>
        <div class="h-4 bg-neutral-800 rounded w-48"></div>
      </div>

      <header class="mb-12 border-b border-neutral-800 pb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="h-4 bg-neutral-800 rounded w-12"></div>
          <div class="h-4 bg-neutral-800 rounded w-2"></div>
          <div class="h-4 bg-neutral-800 rounded w-24"></div>
        </div>
        <div class="h-10 bg-neutral-800 rounded w-full md:w-3/4 mb-4"></div>
        <div class="h-10 bg-neutral-800 rounded w-2/3 mb-6 hidden md:block"></div>
        <div class="h-5 bg-neutral-800 rounded w-full max-w-3xl mb-8"></div>
        
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-neutral-800"></div>
          <div class="space-y-2">
            <div class="h-3 bg-neutral-800 rounded w-20"></div>
            <div class="h-3 bg-neutral-800 rounded w-16"></div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-8 space-y-8">
          <div class="w-full bg-neutral-900 border border-neutral-800 rounded-2xl aspect-[16/9]"></div>
          <div class="space-y-4 pt-4">
            <div class="h-4 bg-neutral-800 rounded w-full"></div>
            <div class="h-4 bg-neutral-800 rounded w-full"></div>
            <div class="h-4 bg-neutral-800 rounded w-5/6"></div>
            <div class="h-6 bg-neutral-800 rounded w-1/3 pt-4"></div>
            <div class="h-4 bg-neutral-800 rounded w-full"></div>
            <div class="h-4 bg-neutral-800 rounded w-4/5"></div>
          </div>
        </div>

        <aside class="lg:col-span-4 hidden lg:flex flex-col gap-8 pl-6 border-l border-neutral-800/60">
          <div class="space-y-3">
            <div class="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
            <div class="h-3 bg-neutral-800 rounded w-full"></div>
            <div class="h-3 bg-neutral-800 rounded w-4/5"></div>
            <div class="h-3 bg-neutral-800 rounded w-5/6"></div>
          </div>
        </aside>
      </div>
    </div>

    <article v-else-if="article" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <nav class="flex items-center gap-2 text-sm text-neutral-400 mb-6">
        <NuxtLink to="/articles" class="hover:text-emerald-400 flex items-center gap-1 transition-colors">
          <UIcon name="i-lucide-book-open" class="w-4 h-4" />
          Article
        </NuxtLink>
        <span class="text-neutral-600">/</span>
        <span class="text-emerald-400 font-medium truncate">{{ article.title }}</span>
      </nav>

      <header class="mb-12 border-b border-neutral-800 pb-8">
        <div class="flex items-center gap-3 text-xs font-semibold text-emerald-400 mb-4 tracking-wider uppercase">
          <span>{{ article.category[0]?.name || 'Article' }}</span>
          <span class="text-neutral-700">•</span>
          <time class="text-neutral-400">{{ article.date }}</time>
        </div>

        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight max-w-4xl">
          {{ article.title }}
        </h1>

        <p v-if="article.description" class="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mb-8">
          {{ article.description }}
        </p>

        <div class="flex flex-wrap gap-6 items-center">
          <div v-for="author in article.authors || [article.author]" :key="author" class="flex items-center gap-3">
            <img 
              :src="article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'" 
              :alt="author" 
              class="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div class="flex flex-col text-xs">
              <span class="font-bold text-neutral-200">{{ author }}</span>
              <span class="text-neutral-500">@{{ author.toLowerCase().replace(/\s+/g, '') }}</span>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-8 space-y-8">
          <div v-if="article.image" class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            <img :src="article.image" :alt="article.title" class="w-full h-auto object-cover aspect-[16/9]" />
          </div>

          <div 
            ref="articleBody"
            class="prose prose-neutral dark:prose-invert max-w-none 
                   prose-headings:scroll-mt-24
                   prose-h2:text-3xl prose-h2:font-extrabold prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4
                   prose-h3:text-2xl prose-h3:font-bold prose-h3:text-neutral-100 prose-h3:mt-8 prose-h3:mb-3
                   prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6
                   prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                   prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-950/20 prose-blockquote:p-4 prose-blockquote:rounded-r-xl"
            v-html="article.content"
          ></div>

          <div class="pt-8 border-t border-neutral-800 flex flex-wrap gap-2">
            <NuxtLink v-for="tag in article.tags" :key="tag.id" :to="`/tags/${tag.id}`">
              <UBadge variant="subtle" color="neutral" class="text-xs px-2.5 py-1">
                #{{ tag.name }}
              </UBadge>
            </NuxtLink>
          </div>
        </div>

        <aside class="lg:col-span-4 sticky top-24 hidden lg:flex flex-col gap-8 self-start pl-6 border-l border-neutral-800/60">
          <div v-if="dynamicToc.length === 0" class="space-y-3">
            <div class="h-4 bg-neutral-800 rounded w-1/3 animate-pulse mb-4"></div>
            <div class="h-3 bg-neutral-800 rounded w-full animate-pulse"></div>
            <div class="h-3 bg-neutral-800 rounded w-4/5 animate-pulse"></div>
            <div class="h-3 bg-neutral-800 rounded w-5/6 animate-pulse"></div>
          </div>

          <div v-else>
          <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Table of Contents
          </h3>
          <ul class="space-y-3 text-sm pl-1">
            <li v-for="item in dynamicToc" :key="item.id" class="transition-all duration-200">
              <a 
                :href="`#${item.id}`" 
                @click="setActive(item.id)"
                class="block transition-all duration-200 line-clamp-1"
                :class="item.active 
                  ? 'text-emerald-400 font-semibold border-l-2 border-emerald-500 pl-2 -ml-[2px]' 
                  : 'text-neutral-400 hover:text-neutral-200 border-l border-transparent pl-2 -ml-[1px]'"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>

          <div class="flex flex-col gap-4 border-t border-neutral-800/80 pt-6">
            <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400">Links</h3>
            <div class="flex flex-col gap-2 text-sm text-neutral-400">
              <a href="#" class="flex items-center gap-2 hover:text-white transition-colors">
                <UIcon name="i-lucide-pen-line" class="w-4 h-4 text-neutral-500" />
                Edit this article
              </a>
            </div>
          </div>
        </aside>

      </div>
    </article>
  </div>
</template>

<style scoped>
/* Memastikan efek kelancaran scroll saat TOC di klik */
:global(html) {
  scroll-behavior: smooth;
}

/* Memaksa gaya masuk ke dalam konten v-html */
:deep(.prose h2) {
  font-size: 1.875rem !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  margin-top: 2.5rem !important;
  margin-bottom: 1rem !important;
  display: block;
}

:deep(.prose h3) {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #f5f5f5 !important;
  margin-top: 2rem !important;
  margin-bottom: 0.75rem !important;
  display: block;
}

:deep(.prose p) {
  font-size: 1rem !important;
  color: #d4d4d4 !important;
  line-height: 1.625 !important;
  margin-bottom: 1.5rem !important;
}

:deep(.prose strong) {
  color: #ffffff !important;
  font-weight: 700 !important;
}
</style>

<script setup lang="ts">
const route = useRoute();
const { article, pending } = await useArticleDetail(route.params.id as string);
const { dynamicToc, articleBody, setActive } = useTableOfContent(article);
</script>