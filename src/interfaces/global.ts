import { User } from "./user";

export interface NavItem {
  name: string;
  href: string;
}

export type Breadcrumb = {
  title: string;
  href: string;
};

export interface Pagination {
  currentPage?: number;
  hasMorePages?: boolean;
  lastPage?: number;
  perPage?: number;
  total?: number;
}

// Matches the Go backend's PaginatedResponse.meta shape. Kept separate
// from `Pagination` above, which is the (currently unused) admin Table
// kit's own pagination shape.
export interface PaginationMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface Base {
  id: string;
  creator?: User;
  createdAt?: string;
  status?: string;
}
