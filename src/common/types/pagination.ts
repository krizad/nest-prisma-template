export interface PageParams {
  page: number;
  size: number;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  headers?: PaginatedHeaders[];
}

export interface PaginatedHeaders {
  key: string;
  label: string;
  sortable?: boolean;
}
