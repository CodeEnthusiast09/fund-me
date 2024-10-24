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

export interface Base {
  id: string;
  creator?: User;
  createdAt?: string;
  status?: string;
}
