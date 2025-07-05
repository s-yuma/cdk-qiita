// hooks/useKnowledgeData.ts
import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

export interface KnowledgeItem {
  userId: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
}

// 認証付きfetcher関数
const authenticatedFetcher = async (url: string) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const useKnowledgeData = () => {
  const { data, error, isLoading } = useSWR(
    "https://jwm993ajle.execute-api.ap-northeast-1.amazonaws.com/prod/test",
    authenticatedFetcher
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
  };
};
