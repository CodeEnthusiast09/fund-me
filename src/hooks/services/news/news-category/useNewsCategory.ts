import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "@/services";
import { News } from "@/interfaces";

export const useNewsCategory = (id: string) => {
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<News>({
    queryKey: ["news=category", id],
    queryFn: () => {
      return clientRequest.news.newsCategoryClientRequest.getOne(id);
    },
  });

  return {
    data: response,
    isPending,
    error,
    isError,
  };
};
