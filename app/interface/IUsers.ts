// app/interface/IUsers.ts
import type { UserModel } from '../model/UserModel';

export interface IUsers {
  /**
   * Mengambil daftar semua user dengan sistem pagination & filter server-side.
   */
  getUsers(
    pageOffset?: number, 
    pageLimit?: number, 
    filters?: { keyword?: string; relation?: string; status?: string }
  ): Promise<{ data: UserModel[]; total: number }>;

  getUserById(id: string): Promise<UserModel>;
  getAnniversariesThisMonth(month?: number): Promise<UserModel[]>;
}