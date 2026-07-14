// app/composables/useUsers.ts
import { computed } from 'vue';
import { useUsersService } from '../services/UsersService';

/**
 * Composable untuk mengambil semua data user secara general
 */
export const useUsersManagement = () => {
  const service = useUsersService();
  const page = ref(1);
  const itemsPerPage = 20;

  // Reactive states untuk kriteria pencarian
  const searchKeyword = ref('');
  const selectedRelation = ref('');
  const selectedStatus = ref('');

  const pageOffset = computed(() => (page.value - 1) * itemsPerPage);

  const { data, pending, error, refresh } = useAsyncData(
    'users-management-list',
    () => service.getUsers(pageOffset.value, itemsPerPage, {
      keyword: searchKeyword.value,
      relation: selectedRelation.value,
      status: selectedStatus.value
    }),
    { watch: [page, searchKeyword, selectedRelation, selectedStatus] }
  );

  watch([searchKeyword, selectedRelation, selectedStatus], () => {
    page.value = 1;
  });

  return {
    users: computed(() => data.value?.data || []),
    totalItems: computed(() => data.value?.total || 0),
    itemsPerPage,
    page,
    searchKeyword,
    selectedRelation,
    selectedStatus,
    pending,
    error,
    refresh
  };
};
/**
 * Composable untuk mengambil data detail satu user berdasarkan ID
 */
export const useUserDetail = (id: string) => {
  const service = useUsersService();
  const { data: user, pending, error, refresh } = useAsyncData(`user-${id}`, () => 
    service.getUserById(id)
  );

  return { user, pending, error, refresh };
};

/**
 * Composable Khusus Anniversary (Ulang Tahun & Pernikahan) Bulan Ini
 * Dilengkapi dengan logic auto-grouping (Today, This Week, Past)
 */
export const useUserAnniversariesThisMonth = (month?: number) => {
  const service = useUsersService();
  
  // 1. Ambil data mentah yang sudah terfilter "Bulan Ini saja" dari Drupal
  const { data: rawUsers, pending, error, refresh } = useAsyncData(
    `users-anniversaries-${month ?? 'current'}`, 
    () => service.getAnniversariesThisMonth(month)
  );

  // 2. Logic grouping dinamis berbasis waktu saat ini
  const anniversaryGroups = computed(() => {
    const groups = {
      today: [] as any[],
      thisWeek: [] as any[],
      pastThisMonth: [] as any[]
    };

    if (!rawUsers.value) return groups;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 
    const currentDate = today.getDate();
    
    // Reset object date hari ini ke jam 00:00:00 agar kalkulasi presisi
    const dateToday = new Date(currentYear, currentMonth, currentDate);

    // Helper untuk mendeteksi status per tanggal
    const processItem = (user: any, rawDateStr: string | null, type: 'birth' | 'wedding') => {
      if (!rawDateStr) return;

      const originalDate = new Date(rawDateStr);
      // Pindahkan komponen tanggal & bulan ke tahun berjalan saat ini
      const anniversaryThisYear = new Date(currentYear, originalDate.getMonth(), originalDate.getDate());
      
      const diffTime = anniversaryThisYear.getTime() - dateToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Duplikat object user untuk disisipkan tipe event-nya
      const userEvent = { ...user, anniversaryType: type };

      if (originalDate.getMonth() === currentMonth && originalDate.getDate() === currentDate) {
        groups.today.push(userEvent);
      } else if (anniversaryThisYear < dateToday) {
        groups.pastThisMonth.push(userEvent);
      } else if (diffDays > 0 && diffDays <= 7) {
        groups.thisWeek.push(userEvent);
      }
    };

    // Iterasi semua user bulan ini untuk dicek ulang tahun & pernikahan-nya
    rawUsers.value.forEach((user) => {
      // Check Ulang Tahun
      if (user.rawBirthDate) {
        processItem(user, user.rawBirthDate, 'birth');
      }
      // Check Ulang Tahun Pernikahan
      if (user.rawWeddingDate) {
        processItem(user, user.rawWeddingDate, 'wedding');
      }
    });

    return groups;
  });

  return {
    rawUsers,
    anniversaryGroups, // Gunakan ini di UI untuk langsung looping kategori
    pending,
    error,
    refresh
  };
};