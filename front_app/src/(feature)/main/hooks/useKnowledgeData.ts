import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

// 認証状態を確認する関数
const checkAuthStatus = async () => {
  try {
    const currentUser = await getCurrentUser();
    console.log("Current user:", currentUser);
    return true;
  } catch (error) {
    console.error("User not authenticated:", error);
    return false;
  }
};

// 認証付きfetcher関数
const authenticatedFetcher = async (url: string) => {
  try {
    // まず認証状態を確認
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      throw new Error("ユーザーが認証されていません。ログインしてください。");
    }

    // Cognitoセッションからトークンを取得
    const session = await fetchAuthSession({ forceRefresh: true });

    // より詳細なデバッグ情報
    console.log("Session:", {
      tokens: session.tokens ? "present" : "missing",
      credentials: session.credentials ? "present" : "missing",
      identityId: session.identityId,
    });

    // accessTokenではなくidTokenを試す
    const accessToken = session.tokens?.accessToken?.toString();
    const idToken = session.tokens?.idToken?.toString();

    const token = accessToken || idToken;

    if (!token) {
      console.error("Token not found in session");
      console.error("Available tokens:", {
        accessToken: !!session.tokens?.accessToken,
        idToken: !!session.tokens?.idToken,
      });
      throw new Error("認証トークンが取得できません。再ログインしてください。");
    }

    console.log("Using token type:", accessToken ? "access" : "id");
    console.log("Token preview:", token.substring(0, 50) + "...");

    // 認証ヘッダー付きでリクエスト
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
      withCredentials: true, // 認証情報を含める
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);

    // エラーの詳細をログ出力
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Response headers:", error.response?.headers);

      // 401エラーの場合、認証が必要であることを明確に示す
      if (error.response?.status === 401) {
        throw new Error("認証が必要です。ログインしてください。");
      }

      // 403エラーの場合、権限不足を示す
      if (error.response?.status === 403) {
        throw new Error("このリソースにアクセスする権限がありません。");
      }
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
      errorRetryCount: 1, // リトライ回数を減らす
      errorRetryInterval: 3000, // リトライ間隔を延長
      shouldRetryOnError: (error) => {
        // 認証エラーや権限エラーの場合はリトライしない
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 403) {
            return false;
          }
        }
        // 認証関連のエラーメッセージの場合もリトライしない
        if (
          error.message.includes("認証") ||
          error.message.includes("ログイン")
        ) {
          return false;
        }
        return true;
      },
      // データの再取得を制御
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false, // 古いデータを自動更新しない
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
