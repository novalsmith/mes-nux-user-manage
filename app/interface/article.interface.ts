// app/core/article/article.interface.ts
import type { Article } from '@/model/article.entity';

export interface ArticleInterface {
  // Ubah 'string' menjadi union type yang sama dengan di API
  findAll(type: 'article' | 'recipe'): Promise<Article[]>;
}

export interface ArticleInterface {
  findAll(): Promise<Article[]>;
  // Tambahkan baris ini:
  findById(id: string): Promise<any>; 
  findByTag(tagId: string): Promise<Article[]>;

}
 