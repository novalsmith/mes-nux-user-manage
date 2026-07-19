// app/services/users.service.ts
import { useUsersApi } from '../infrastructure/drupal/UsersApi';
import type { IUsers } from '../interface/IUsers';
import type { UserModel } from '../model/UserModel';

export const useUsersService = (): IUsers => {
  const api = useUsersApi();
  const config = useRuntimeConfig();
  const drupalBaseUrl = config.public.drupalBaseUrl;

  // LOGIKA TRANSFORMATION / MAPPER (Mengubah raw JSON:API ke Clean Model)
  const mapRawToUser = (item: any, included: any[] = []): UserModel => {
    // 1. Ambil URL Avatar dari Array Included
    const avatarFileId = item.relationships?.user_picture?.data?.id;
    const avatarFileItem = included?.find((inc: any) => inc.id === avatarFileId);
    const avatarUrl = avatarFileItem?.attributes?.uri?.url 
      ? `${drupalBaseUrl}${avatarFileItem.attributes.uri.url}` 
      : null;

    // 2. Format Tanggal ke Lokalisasi Indonesia (DD MMMM YYYY)
    const formatDateIndo = (dateString: string | null): string => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const rawBirth = item.attributes.field_birthdate || '';
    const rawWedding = item.attributes.field_wedding_date || null;

    // 3. Mapping Roles dari Drupal
    const roles = item.relationships?.roles?.data?.map((roleRef: any) => {
      // Menghilangkan prefix target_id bawaan Drupal jika ada, atau gunakan id langsung
      return roleRef.id.replace('user_role--', '');
    }) || [];

    // 4. Kembalikan objek bersih yang siap dikonsumsi komponen UI Nuxt
    return {
      id: item.id,
      username: item.attributes.name,
      fullName: item.attributes.field_full_name || item.attributes.name || 'Warga',
      familyRelation: item.attributes.field_family_relation || 'Anggota Lain',
      birthDate: formatDateIndo(rawBirth),
      weddingDate: rawWedding ? formatDateIndo(rawWedding) : null,
      rawBirthDate: rawBirth, // PENTING: Digunakan untuk logic computed grouping nanti
      rawWeddingDate: rawWedding, // PENTING: Digunakan untuk logic computed grouping nanti
      avatar: avatarUrl,
      roles: roles
    };
  };

  return {
async getUsers(
    pageOffset = 0, 
    pageLimit = 20, 
    filters?: { keyword?: string; relation?: string; status?: string }
  ): Promise<{ data: UserModel[], total: number }> {
    
    // Kirim parameter filter ke repository / API
    const raw = await api.findAll(pageOffset, pageLimit, filters);
    
    if (!raw || !raw.data) return { data: [], total: 0 };
    
    const mappedData = raw.data.map((item: any) => mapRawToUser(item, raw.included));
    const totalRecords = raw.meta?.count || mappedData.length;

    return {
      data: mappedData,
      total: totalRecords
    };
  },


    async getUserById(id: string): Promise<UserModel> {
      const raw = await api.findById(id);
      if (!raw || !raw.data) {
        throw new Error(`Data user tidak ditemukan untuk ID: ${id}`);
      }
      
      return mapRawToUser(raw.data, raw.included);
    },

    async getAnniversariesThisMonth(month?: number): Promise<UserModel[]> {
      // Mengambil data yang sudah terfilter "Bulan Ini" saja dari backend Drupal via API
      const raw = await api.findAnniversariesByMonth(month);
      if (!raw || !raw.data) return [];

      return raw.data.map((item: any) => mapRawToUser(item, raw.included));
    }
  };
};