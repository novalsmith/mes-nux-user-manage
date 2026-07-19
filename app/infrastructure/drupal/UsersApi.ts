// app/implementation/users.api.ts
import type { UsersRepository } from '../../repository/UsersRepository';

export const useUsersApi = (): UsersRepository => {
  // Drupal JSON:API path khusus untuk core entity User
  const jsonPath = '/api/drupal/jsonapi/user/user';

  // 1. Definisikan include default untuk relasi yang ada di akun User (jika ada)
  // Misalnya menyertakan gambar profil user atau data reference lainnya
  const defaultIncludes = [
    'user_picture',
    // 'field_keppala_keluarga' // <-- Aktifkan jika ingin menyertakan data relasi parent kepala keluarga
  ];

  // 2. Helper function untuk membangun string include secara dinamis
  const getIncludeQuery = (customIncludes?: string[]): string => {
    const combined = customIncludes 
      ? [...new Set([...defaultIncludes, ...customIncludes])]
      : defaultIncludes;
    
    return combined.length > 0 ? `include=${combined.join(',')}` : '';
  };

  // 3. Helper function untuk mendapatkan string pola bulan berjalan (misal: Juli -> '-07-')
  const getMonthPattern = (month?: number): string => {
    const targetMonth = month !== undefined ? month : new Date().getMonth() + 1;
    const formattedMonth = String(targetMonth).padStart(2, '0');
    return `-${formattedMonth}-`;
  };

  return {
 async findAll(
  pageOffset = 0, 
  pageLimit = 20, 
  filters?: { keyword?: string; relation?: string; status?: string },
  customIncludes?: string[]
): Promise<any> {
  
  // 1. Inisialisasi URLSearchParams untuk menyusun query parameter secara dinamis
  const params = new URLSearchParams();

  // 2. Tambahkan parameter Pagination bawaan Drupal JSON:API
  params.append('page[offset]', pageOffset.toString());
  params.append('page[limit]', pageLimit.toString());

  // 3. Tambahkan Exposed Filters sesuai konfigurasi di Drupal Views Anda
  // Catatan: Sesuaikan string key (misal: 'roles_exposed') dengan Machine Name / Filter Identifier di Drupal Views jika berbeda
  if (filters?.keyword) {
    params.append('roles_exposed', filters.keyword); 
  }
  
  if (filters?.relation) {
    params.append('family_relation_exposed', filters.relation);
  }
  
  // Drupal biasanya menerima status berupa '1' (Aktif) atau '0' (Non-Aktif)
  if (filters?.status !== undefined && filters?.status !== '') {
    params.append('status', filters.status);
  }

  // 4. Tambahkan Custom Includes jika ada relasi yang perlu ditarik (misal: file gambar/avatar)
  if (customIncludes && customIncludes.length > 0) {
    params.append('include', customIncludes.join(','));
  } else {
    // Jika Anda menggunakan fungsi helper bawaan lama Anda (getIncludeQuery)
    const includeString = getIncludeQuery(customIncludes);
    if (includeString) {
      // helper lama biasanya menghasilkan 'include=a,b', kita ambil value-nya saja
      const valueOnly = includeString.replace('include=', '');
      params.append('include', valueOnly);
    }
  }

  // 5. Bangun URL Final
  const queryString = params.toString();
  const url = queryString ? `${jsonPath}?${queryString}` : jsonPath;

  // 6. Eksekusi fetch data ke Drupal API
  return await $fetch<any>(url).catch(() => null);
},

    async findById(id: string, customIncludes?: string[]): Promise<any> {
      const includeString = getIncludeQuery(customIncludes);
      const url = includeString ? `${jsonPath}/${id}?${includeString}` : `${jsonPath}/${id}`;

      return await $fetch<any>(url).catch(() => null);
    },

    async findAnniversariesByMonth(month?: number, customIncludes?: string[]): Promise<any> {
      const includeString = getIncludeQuery(customIncludes);
      const monthPattern = getMonthPattern(month);

      // Bangun filter OR dinamis untuk query tanggal lahir atau tanggal pernikahan yang mengandung '-MM-'
      const filters = [
        // Definisikan group penyambung logika 'OR'
        'filter[anniversary-group][group][conjunction]=OR',

        // Kondisi 1: Filter Birth Date (Bulan Lahir)
        'filter[birthday-filter][condition][path]=field_birthdate',
        'filter[birthday-filter][condition][operator]=CONTAINS',
        `filter[birthday-filter][condition][value]=${monthPattern}`,
        'filter[birthday-filter][condition][memberOf]=anniversary-group',

        // Kondisi 2: Filter Wedding Date (Bulan Pernikahan)
        'filter[wedding-filter][condition][path]=field_wedding_date',
        'filter[wedding-filter][condition][operator]=CONTAINS',
        `filter[wedding-filter][condition][value]=${monthPattern}`,
        'filter[wedding-filter][condition][memberOf]=anniversary-group'
      ];

      // Gabungkan string filter dengan tanda '&'
      let url = `${jsonPath}?${filters.join('&')}`;
      
      // Jika ada include, tambahkan di akhir URL
      if (includeString) {
        url += `&${includeString}`;
      }

      return await $fetch<any>(url).catch(() => null);
    }
  };
};