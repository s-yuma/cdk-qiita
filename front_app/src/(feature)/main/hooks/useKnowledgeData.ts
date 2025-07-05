import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth"; // Amplify v6+

const fetcher = async (url: string) => {
  const { tokens } = await fetchAuthSession();
  console.log(tokens);
  
  const idToken = tokens?.idToken?.toString(); // ← Cognito ID トークン
  return axios
    .get(url, {
      headers: { Authorization: `Bearer ${idToken}` }, // Cognito 用デフォルトヘッダー名
    })
    .then((res) => res.data);
};

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
    "https://jwm993ajle.execute-api.ap-northeast-1.amazonaws.com/prod/test",
    fetcher
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
  };
};
