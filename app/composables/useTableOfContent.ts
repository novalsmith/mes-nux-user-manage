import type { TableOfContentModel } from '~/model/TableOfContentModel';
export const useTableOfContent = (articleData: Ref<any>, selector?: string) => {
  // Gunakan tipe data lokal jika interface TableOfContentModel belum punya properti 'active'
  const dynamicToc = ref<(TableOfContentModel & { active?: boolean })[]>([]);
  const articleBody = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  const generateToc = async () => {
    if (!import.meta.client) return; 
    
    await nextTick();
    if (!articleBody.value) return;

    // Bersihkan observer lama jika ada sebelum membuat baru
    if (observer) observer.disconnect();

    selector = selector || 'h2';
    const headings = articleBody.value.querySelectorAll(selector);
    const tocList: (TableOfContentModel & { active?: boolean })[] = [];

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