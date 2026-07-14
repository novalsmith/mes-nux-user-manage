// app/repository/UsersRepository.ts
export interface UsersRepository {
  /**
   * Mengambil data user secara lengkap dengan dukungan pagination dan filter.
   * @param pageOffset Index awal data (default: 0)
   * @param pageLimit Jumlah data per halaman (default: 20)
   * @param filters Kriteria penyaringan data (keyword nama, hubungan keluarga, status)
   * @param customIncludes Array untuk menyertakan relasi entitas tambahan (JSON:API include)
   */
  findAll(
    pageOffset?: number, 
    pageLimit?: number, 
    filters?: { keyword?: string; relation?: string; status?: string },
    customIncludes?: string[]
  ): Promise<any>;

  /**
   * Mengambil data user berdasarkan ID (UUID).
   */
  findById(id: string, customIncludes?: string[]): Promise<any>;

  /**
   * Mengambil user yang berulang tahun ATAU memiliki ulang tahun pernikahan pada bulan tertentu.
   * @param month Angka bulan (1-12). Jika kosong, otomatis menggunakan bulan berjalan saat ini.
   */
  findAnniversariesByMonth(month?: number, customIncludes?: string[]): Promise<any>;
}