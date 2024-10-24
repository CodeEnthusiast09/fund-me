"use client";

import { DataTableFilter } from "@/interfaces";
import { DEFAULT_TABLE_FILTERS } from "@/lib/constants";
import { useState } from "react";

export const useTableFilter = () => {
  const [tableFilter, setTableFilter] = useState<DataTableFilter>(
    DEFAULT_TABLE_FILTERS
  );

  const setPage = (page: number) => {
    setTableFilter((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSearch = (keyword: string) => {
    setTableFilter((prev) => ({
      ...prev,
      search: keyword.trim(),
    }));
  };

  return { tableFilter, setPage, handleSearch };
};
