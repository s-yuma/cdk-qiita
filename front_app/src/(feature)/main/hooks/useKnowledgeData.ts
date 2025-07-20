// hooks/useKnowledgeData.ts
import { fetchAuthSession } from "aws-amplify/auth";
import useSWR from "swr";
import axios from "axios";

async function getIdToken() {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString(); // これが必要なIDトークン
}

const idToken = await getIdToken();
const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: { Authorization: idToken },
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
