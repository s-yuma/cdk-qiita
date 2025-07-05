import useSWR from "swr";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const fetcher = async (url: string) => {
  try {
    // 認証状態を詳細にチェック
    const session = await fetchAuthSession();

    // セッション自体の存在確認
    if (!session) {
      throw new Error("認証セッションが取得できませんでした");
    }

    // トークンの詳細チェック
    const { tokens } = session;
    if (!tokens) {
      throw new Error("認証トークンが存在しません");
    }

    // IDトークンの存在と有効性チェック
    if (!tokens.idToken) {
      throw new Error("IDトークンが取得できませんでした");
    }

    const idToken = tokens.idToken.toString();

    // トークンの内容チェック（空文字列でないか）
    if (!idToken || idToken.trim() === "") {
      throw new Error("IDトークンが無効です");
    }

    console.log("認証トークン取得成功");

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10秒のタイムアウト
    });

    return response.data;
  } catch (error) {
    console.error("トークン取得エラー:", error);

    // エラーの詳細をログに出力
    if (axios.isAxiosError(error)) {
      console.error("API呼び出しエラー:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
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
    fetcher,
    {
      // エラー時のリトライ設定を改善
      shouldRetryOnError: (error) => {
        // 認証関連エラーの場合はリトライしない
        if (
          error.message.includes("認証") ||
          error.message.includes("トークン") ||
          error.message.includes("セッション")
        ) {
          return false;
        }
        // ネットワークエラーの場合のみリトライ
        return true;
      },
      // リトライ回数を制限
      errorRetryCount: 3,
      // リトライ間隔を設定
      errorRetryInterval: 1000,
      // 自動リフレッシュを無効化
      refreshInterval: 0,
      // フォーカス時の再検証を無効化
      revalidateOnFocus: false,
      // ウィンドウが再表示された時の再検証を無効化
      revalidateOnReconnect: false,
      // 初回読み込み時のみフェッチするための設定
      dedupingInterval: 60000, // 1分間は重複リクエストを防ぐ
    }
  );

  return {
    knowledgeData: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate, // 手動でリフェッチするためのメソッド
  };
};
