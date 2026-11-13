import { paginate } from './paginate.js';

const PAGE_THREE = { page: 3, limit: 20 };
const TOTAL_LINKS = 45;

describe('paginate', () => {
  it('asks for the right slice of rows', async () => {
    const fetchPage = vi.fn().mockResolvedValue([]);

    await paginate(PAGE_THREE, fetchPage, async () => TOTAL_LINKS);

    expect(fetchPage).toHaveBeenCalledWith({ skip: 40, take: 20 });
  });

  it('returns the items with the total, page and limit', async () => {
    const items = [{ id: 'a' }, { id: 'b' }];

    const result = await paginate(
      PAGE_THREE,
      async () => items,
      async () => TOTAL_LINKS,
    );

    expect(result).toEqual({
      items,
      total: TOTAL_LINKS,
      page: 3,
      limit: 20,
    });
  });
});
