// app/composables/useArticle.ts
import { ref, nextTick, watch, type Ref } from 'vue';
import { useArticleService } from '../services/ArticleService';
import type { TocItem } from '~/model/ArticleModel';

export const useArticle = () => {
  const service = useArticleService();
  const { data: articles, pending, error } = useAsyncData('articles-list', () => 
    service.getArticles()
  );
  return { articles, pending, error };
};

export const useArticleDetail = (id: string) => {
  const service = useArticleService();
  const { data: article, pending, error } = useAsyncData(`article-${id}`, () => 
    service.getArticleById(id)
  );

  return { article, pending, error };
};

export const getArticlesByTag = (id: string) => {
  const service = useArticleService();
  const { data: articles, pending, error } = useAsyncData(`articles-tag-${id}`, () => 
    service.getArticlesByTag(id)
  );

  return { articles, pending, error };
};

export const useArticleSearch = (keyword: Ref<string>) => {
  const service = useArticleService();

  const { data: articles, pending, error, refresh } = useAsyncData(
    `articles-search`,
    () => service.searchArticlesByTitle(keyword.value),
    { watch: [keyword] }
  );

  return { articles, pending, error, refresh };
};

export const useTableOfContent = (articleData: Ref<any>) => {
  // Gunakan tipe data lokal jika interface TocItem belum punya properti 'active'
  const dynamicToc = ref<(TocItem & { active?: boolean })[]>([]);
  const articleBody = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  const generateToc = async () => {
    if (!import.meta.client) return; 
    
    await nextTick();
    if (!articleBody.value) return;

    // Bersihkan observer lama jika ada sebelum membuat baru
    if (observer) observer.disconnect();

    const headings = articleBody.value.querySelectorAll('h2');
    const tocList: (TocItem & { active?: boolean })[] = [];

    // Konfigurasi IntersectionObserver untuk mendeteksi element di layar
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Jika element masuk area pandang, set active = true untuk item terkait
          dynamicToc.value = dynamicToc.value.map((item) => ({
            ...item,
            active: item.id === entry.target.id
          }));
        }
      });
    }, {
      rootMargin: '-80px 0px -70% 0px' // Offset area deteksi (menghindari nabrak navbar atas)
    });

    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      if (!text.trim()) return;
      
      let id = heading.id || text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (!id) id = `section-${index}`;
      heading.id = id;
      
      tocList.push({ id, text, active: index === 0 }); // Default aktifkan yang pertama
      
      // Daftarkan heading h2 ke observer untuk dipantau
      if (observer) observer.observe(heading);
    });

    dynamicToc.value = tocList;
  };

  onMounted(() => {
    generateToc();
  });

  // Bersihkan observer saat halaman ditinggalkan agar memory tidak bocor
  onUnmounted(() => {
    if (observer) observer.disconnect();
  });

  watch(() => articleData.value, () => { generateToc(); }, { deep: true });

  // Fungsi tambahan jika ingin memaksa status aktif langsung berubah instan saat di-klik
  const setActive = (id: string) => {
    dynamicToc.value = dynamicToc.value.map(item => ({
      ...item,
      active: item.id === id
    }));
  };

  return {
    dynamicToc,
    articleBody,
    setActive,
    generateToc
  };
};