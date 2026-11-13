import { PaginationQueryDto } from './pagination-query.dto.js';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export async function paginate<T>(
  { page, limit }: PaginationQueryDto,
  fetchPage: (range: { skip: number; take: number }) => Promise<T[]>,
  count: () => Promise<number>,
): Promise<Paginated<T>> {
  const [items, total] = await Promise.all([
    fetchPage({ skip: (page - 1) * limit, take: limit }),
    count(),
  ]);
  return { items, total, page, limit };
}
