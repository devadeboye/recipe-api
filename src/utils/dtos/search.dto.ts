export class SearchFilterDto {
  public limit: number;
  public page: number;
}

export class SearchResult<T> {
  public limit: number;
  public nextPage: number | null;
  public totalPages: number;
  public currentPage: string;
  public foundItems: T;
}
