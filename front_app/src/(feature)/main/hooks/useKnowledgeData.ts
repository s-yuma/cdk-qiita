// hooks/useKnowledgeData.ts
import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

// 認証付きfetcher関数
const authenticatedFetcher = async (url: string) => {
  try {
    // Cognitoセッションからトークンを取得
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    if (!token) {
      throw new Error("認証トークンが取得できません");
    }

    // 認証ヘッダー付きでリクエスト
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
    authenticatedFetcher,
    {
      // エラー時のリトライ設定
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
    error, // エラー情報も返す
  };
};
