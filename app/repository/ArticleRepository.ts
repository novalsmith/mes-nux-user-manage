// app/repository/article.repository.ts
export interface ArticleRepository {
  findAll(): Promise<any>;
  findById(id: string): Promise<any>;
  findByTag(tagId: string): Promise<any>;
  searchByTitle(keyword: string, customIncludes?: string[]): Promise<any>;
}