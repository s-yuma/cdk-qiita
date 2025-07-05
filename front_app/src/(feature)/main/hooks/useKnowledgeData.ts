import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

// 認証付きfetcher関数
const authenticatedFetcher = async (url: string) => {
  try {
    // Cognitoセッションからトークンを取得
    const session = await fetchAuthSession();

    // より詳細なデバッグ情報
    console.log("Session:", session);
    console.log("Tokens:", session.tokens);

    const token = session.tokens?.accessToken?.toString();

    if (!token) {
      console.error("Token not found in session");
      throw new Error("認証トークンが取得できません");
    }

    console.log("Using token:", token.substring(0, 50) + "...");

    // 認証ヘッダー付きでリクエスト
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // タイムアウト設定
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);

    // エラーの詳細をログ出力
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Response headers:", error.response?.headers);
    }

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
  const { data, error, isLoading, mutate } = useSWR<KnowledgeItem[]>(
    "https://jwm993ajle.execute-api.ap-northeast-1.amazonaws.com/prod/test",
    authenticatedFetcher,
    {
      // エラー時のリトライ設定を調整
      errorRetryCount: 2, // 3回 → 2回に削減
      errorRetryInterval: 2000, // 1秒 → 2秒に延長
      shouldRetryOnError: (error) => {
        // 認証エラーの場合はリトライしない
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 403) {
            return false;
          }
        }
        return true;
      },
      // データの再取得を制御
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate, // 手動でデータを再取得するための関数
  };
};
