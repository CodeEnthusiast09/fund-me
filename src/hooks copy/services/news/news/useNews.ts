"use client";

import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "@/services";
import { Pagination, News } from "@/interfaces";
import { useTableFilter } from "@/hooks/useTableFilter";

export const useNews = () => {
  const { setPage, tableFilter, handleSearch } = useTableFilter();

  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<{
    data: News[];
    pagination: Pagination;
  }>({
    queryKey: ["news", tableFilter],
    queryFn: () => {
      return clientRequest.news.newsClientRequest.getAll(tableFilter);
    },
  });

  return {
    data: response?.data,
    pagination: response?.pagination,
    isPending,
    error,
    isError,
    setPage,
    handleSearch,
  };
};
