import { Pagination } from "@/interfaces";

export type PaginationProps = {
  pagination: Pagination;
  onPaginate: (page: number) => void;
};
