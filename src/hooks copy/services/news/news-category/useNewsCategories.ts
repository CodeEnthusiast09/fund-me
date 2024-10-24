import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "@/services";
import { Pagination, NewsCategories } from "@/interfaces";
import { useTableFilter } from "@/hooks/useTableFilter";

export const useNewsCategories = () => {
  const { setPage, tableFilter, handleSearch } = useTableFilter();

  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<{
    data: NewsCategories[];
    pagination: Pagination;
  }>({
    queryKey: ["news-category", tableFilter],
    queryFn: () => {
      return clientRequest.news.newsCategoryClientRequest.getAll(tableFilter);
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
