"use client";

import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "@/services";
import { News } from "@/interfaces";

export const useSingleNews = (id: string) => {
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<News>({
    queryKey: ["news", id],
    queryFn: () => {
      return clientRequest.news.newsClientRequest.getOne(id);
    },
  });

  return {
    data: response,
    isPending,
    error,
    isError,
  };
};
