// app/model/UserModel.ts
export interface UserModel {
  id: string;
  username: string;
  fullName: string;
  familyRelation: string;
  birthDate: string;        // Format readable Indonesia (e.g., "11 Desember 1992")
  weddingDate: string | null;
  rawBirthDate: string;     // Menyimpan string asli 'YYYY-MM-DD' untuk kebutuhan kalkulasi logic kelompok
  rawWeddingDate: string | null;
  avatar: string | null;
  roles: string[];
}