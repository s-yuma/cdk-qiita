// hooks/useKnowledgeData.ts
import useSWR from "swr";
import axios from "axios";
const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: {},
    })
    .then((res) => res.data);

export interface KnowledgeItem {
  userId: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
}

export const useKnowledgeData = () => {
  const { data, error, isLoading } = useSWR<KnowledgeItem[]>(
    process.env.NEXT_PUBLIC_URL,
    fetcher
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
  };
};
