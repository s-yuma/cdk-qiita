import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth"; // Amplify v6+

const fetcher = async (url: string) => {
  try {
    const { tokens } = await fetchAuthSession();

    // トークンの存在確認
    if (!tokens?.idToken) {
      throw new Error("認証トークンが取得できませんでした");
    }

    const idToken = tokens.idToken.toString();
    console.log(
      "取得したトークン:",
      idToken ? "トークン取得成功" : "トークン取得失敗"
    );

    return axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data);
  } catch (error) {
    console.error("トークン取得エラー:", error);
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
    fetcher,
    {
      // エラー時のリトライ設定
      shouldRetryOnError: (error) => {
        // 認証エラーの場合はリトライしない
        return !error.message.includes("認証トークンが取得できませんでした");
      },
      // リフレッシュ間隔
      refreshInterval: 0, // 自動リフレッシュを無効化
      // 初回読み込み時のみフェッチ
      revalidateOnFocus: false,
    }
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
    error,
  };
};
