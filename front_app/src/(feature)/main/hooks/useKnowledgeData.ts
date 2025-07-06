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
    "https://jwm993ajle.execute-api.ap-northeast-1.amazonaws.com/prod//test",
    fetcher
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
  };
};
