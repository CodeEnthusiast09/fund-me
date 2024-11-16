import { ReactNode } from "react";

import { Pagination } from "./global";

export interface TableInterface {
  data: object[];
  columns: {
    header?: any;
    accessorKey?: string;
    cell?: ((info: TableCell) => ReactNode) | undefined;
  }[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  handleSearch?: Function;
  isLoading?: boolean;
  multiSelect?: boolean;
  multiSelectActions?: ReactNode;
  onMultiSelect?: Function;
  setPage?: (page: number) => void;
  pagination?: Pagination;
  emptyDataIcon?: ReactNode;
  emptyDataRowClassName?: string;
  hasBottomPadding?: boolean;
  footerTitle?: string;
  footerValue?: string;
  showPreTableHeader?: boolean;
  showSerialNumber?: boolean;
  stickyFirstColumn?: boolean;
}

export interface DataTableFilter {
  limit?: number;
  page?: number;
  order?: string;
  search?: string;
}

export interface DataCampaignFilter {
  limit?: number;
  order?: string;
  search?: string;
}

export interface TableCell {
  getValue: Function;
  row: any;
}
