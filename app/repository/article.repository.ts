// app/core/article/article.repository.ts
import type { Article } from '~/model/article.entity';

export interface ArticleRepository {
  // Ubah 'string' menjadi union type yang sama dengan di API
  findAll(type: 'article' | 'recipe'): Promise<Article[]>;
}

export interface ArticleRepository {
  findAll(): Promise<Article[]>;
  // Tambahkan baris ini:
  findById(id: string): Promise<any>; 
  findByTag(tagId: string): Promise<Article[]>;

}
 